import * as XLSX from 'xlsx';

export function exportTableToExcel(
  tableId: string,
  fileName: string = 'Export.xlsx',
  sheetName: string = 'Sheet1'
): void {
  const element = document.getElementById(tableId);
  if (!element) {
    console.error(`Table element with ID '${tableId}' not found`);
    return;
  }
  const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  const workbook: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, fileName);
}

export interface ExcelExportColumn {
  key: string;
  header: string;
  width?: number;
  maxWidth?: number;
  minWidth?: number;
}

export interface ExcelExportOptions {
  fileName: string;
  sheetName?: string;
  columns: ExcelExportColumn[];
  data: any[];
  freezeHeaderRow?: boolean;
  compression?: boolean;
  cellStyles?: boolean;
  chunkSize?: number; 
  onProgress?: (progress: { current: number; total: number; percentage: number }) => void;
}

export interface ExcelExportResult {
  success: boolean;
  error?: string;
  fileName?: string;
}




async function downloadExcelFile(
  workbook: XLSX.WorkBook,
  fileName: string,
  options: XLSX.WritingOptions,
  recordCount: number
): Promise<void> {
  if (recordCount > 50000) {
    const excelBuffer = XLSX.write(workbook, options);
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  } else {
    XLSX.writeFile(workbook, fileName, options);
  }

  await new Promise(resolve => setTimeout(resolve, 200));
}


export function createColumnsFromTableConfig(
  tableColumns: Array<{ key: string; header: string; width?: string }>
): ExcelExportColumn[] {
  return tableColumns.map(col => ({
    key: col.key,
    header: col.header,
    width: col.width ? parseFloat(col.width) : undefined,
    maxWidth: 60,
    minWidth: 10
  }));
}

export interface DetailPageMetaField {
  label: string;
  value: string | number | null | undefined;
}

export interface DetailPageField {
  label: string;
  value: string | number | null | undefined;
}

export interface DetailPageTableColumn {
  key: string;
  header: string;
}

export interface DetailPageTableDomSection {
  type: 'table-dom';
  title: string;
  tableId: string;
  excludeColumnIndexes?: number[];
}

export interface DetailPageTableDataSection {
  type: 'table-data';
  title: string;
  columns: DetailPageTableColumn[];
  rows: Array<Record<string, unknown>>;
}

export type DetailPageSection =
  | DetailPageTableDomSection
  | DetailPageTableDataSection;

export interface DetailPageExcelExportConfig {
  fileName: string;
  sheetName?: string;
  title: string;
  meta?: DetailPageMetaField[];
  fields?: DetailPageField[];
  sections?: DetailPageSection[];
  options?: {
    forceTextDates?: boolean;
    columnWidths?: number[];
  };
}

export interface DetailPageExcelExportResult {
  success: boolean;
  fileName?: string;
  error?: string;
}

export function cellValueToPlainText(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
}

function blankRow(width = 1): string[] {
  return Array.from({ length: width }, () => '');
}

function buildMetaRow(meta: DetailPageMetaField[]): string[] {
  const row: string[] = [];
  for (const item of meta) {
    row.push(item.label, cellValueToPlainText(item.value));
  }
  return row;
}

function hasAnyMetaValue(meta: DetailPageMetaField[]): boolean {
  return meta.some(
    (m) => cellValueToPlainText(m.value).trim() !== ''
  );
}

export function appendTableDataSection(
  aoa: string[][],
  section: DetailPageTableDataSection
): void {
  aoa.push(blankRow());
  aoa.push([section.title]);
  aoa.push(section.columns.map((c) => c.header));
  for (const row of section.rows) {
    aoa.push(
      section.columns.map((c) => cellValueToPlainText(row[c.key]))
    );
  }
}

function appendTableDomSection(
  aoa: string[][],
  section: DetailPageTableDomSection,
  readDom: (
    tableId: string,
    excludeColumnIndexes?: number[]
  ) => { ok: true; rows: string[][] } | { ok: false; error: string }
): { ok: true } | { ok: false; error: string } {
  const read = readDom(
    section.tableId,
    section.excludeColumnIndexes ?? []
  );
  if (!read.ok) {
    return read;
  }
  aoa.push(blankRow());
  aoa.push([section.title]);
  for (const row of read.rows) {
    aoa.push(row);
  }
  return { ok: true };
}

/** Title, meta, and fields only — no table sections. */
export function buildDetailPageHeaderAoA(
  config: DetailPageExcelExportConfig
): string[][] {
  const aoa: string[][] = [];
  aoa.push([config.title]);
  aoa.push(blankRow());

  const meta = config.meta ?? [];
  if (meta.length && hasAnyMetaValue(meta)) {
    aoa.push(buildMetaRow(meta));
    aoa.push(blankRow());
  }

  for (const field of config.fields ?? []) {
    aoa.push([field.label, cellValueToPlainText(field.value)]);
  }

  return aoa;
}

/** Appends sections in config order (table-data and table-dom). */
export function appendDetailPageSections(
  aoa: string[][],
  sections: DetailPageSection[] = [],
  readDom: (
    tableId: string,
    excludeColumnIndexes?: number[]
  ) => { ok: true; rows: string[][] } | { ok: false; error: string } = readHtmlTableToAoA
): { ok: true } | { ok: false; error: string } {
  for (const section of sections) {
    if (section.type === 'table-data') {
      appendTableDataSection(aoa, section);
    } else {
      const result = appendTableDomSection(aoa, section, readDom);
      if (!result.ok) {
        return result;
      }
    }
  }
  return { ok: true };
}

/** Exported for unit tests — builds sheet as array-of-arrays (all strings). */
export function buildDetailPageAoA(
  config: DetailPageExcelExportConfig
): string[][] {
  const aoa = buildDetailPageHeaderAoA(config);
  appendDetailPageSections(
    aoa,
    (config.sections ?? []).filter((s) => s.type === 'table-data')
  );
  return aoa;
}

export function getDomCellPlainText(cell: Element): string {
  const input = cell.querySelector('input, textarea, select') as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | null;
  if (input) {
    if (input instanceof HTMLInputElement && input.type === 'checkbox') {
      return input.checked ? 'Y' : 'N';
    }
    return cellValueToPlainText(input.value);
  }
  const clone = cell.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('button').forEach((b) => b.remove());
  return cellValueToPlainText(clone.textContent?.replace(/\s+/g, ' ').trim());
}

export function readHtmlTableToAoA(
  tableId: string,
  excludeColumnIndexes: number[] = []
): { ok: true; rows: string[][] } | { ok: false; error: string } {
  const el = document.getElementById(tableId);
  if (!el) {
    return { ok: false, error: `Table element with ID '${tableId}' not found` };
  }
  const table = el.tagName === 'TABLE' ? el : el.querySelector('table');
  if (!table) {
    return { ok: false, error: `No <table> found for ID '${tableId}'` };
  }

  const exclude = new Set(excludeColumnIndexes);
  const rows: string[][] = [];
  table.querySelectorAll('tr').forEach((tr) => {
    const cells = Array.from(tr.children).filter(
      (c) => c.tagName === 'TD' || c.tagName === 'TH'
    );
    const values = cells
      .map((c, idx) => ({ idx, text: getDomCellPlainText(c) }))
      .filter((c) => !exclude.has(c.idx))
      .map((c) => c.text);
    if (values.length) {
      rows.push(values);
    }
  });
  return { ok: true, rows };
}

function applyColumnWidths(
  worksheet: XLSX.WorkSheet,
  aoa: string[][],
  override?: number[]
): void {
  if (override?.length) {
    worksheet['!cols'] = override.map((wch) => ({ wch }));
    return;
  }
  const colCount = Math.max(0, ...aoa.map((r) => r.length));
  const widths: number[] = [];
  for (let c = 0; c < colCount; c++) {
    let max = 10;
    for (const row of aoa) {
      const len = (row[c] ?? '').length;
      if (len > max) max = len;
    }
    widths.push(Math.min(60, Math.max(10, max + 2)));
  }
  worksheet['!cols'] = widths.map((wch) => ({ wch }));
}

function applyTableBorders(
  worksheet: XLSX.WorkSheet,
  startRow: number,
  endRow: number,
  colCount: number
): void {
  void worksheet;
  void startRow;
  void endRow;
  void colCount;
}

export function exportDetailPageToExcel(
  config: DetailPageExcelExportConfig
): DetailPageExcelExportResult {
  try {
    if (!config?.fileName?.trim()) {
      return { success: false, error: 'fileName is required' };
    }
    if (!config?.title?.trim()) {
      return { success: false, error: 'title is required' };
    }

    const aoa = buildDetailPageHeaderAoA(config);
    const sectionsResult = appendDetailPageSections(
      aoa,
      config.sections ?? []
    );
    if (!sectionsResult.ok) {
      return { success: false, error: sectionsResult.error };
    }

    const worksheet = XLSX.utils.aoa_to_sheet(aoa);
    const forceTextDates = config.options?.forceTextDates !== false;
    if (forceTextDates) {
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      for (let R = range.s.r; R <= range.e.r; R++) {
        for (let C = range.s.c; C <= range.e.c; C++) {
          const addr = XLSX.utils.encode_cell({ r: R, c: C });
          const cell = worksheet[addr];
          if (cell && cell.v !== undefined && cell.v !== null) {
            cell.t = 's';
            cell.v = String(cell.v);
            delete cell.w;
            delete cell.z;
          }
        }
      }
    }

    applyColumnWidths(worksheet, aoa, config.options?.columnWidths);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      (config.sheetName || 'Details').slice(0, 31)
    );
    XLSX.writeFile(workbook, config.fileName);

    return { success: true, fileName: config.fileName };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown export error';
    return { success: false, error: message };
  }
}

