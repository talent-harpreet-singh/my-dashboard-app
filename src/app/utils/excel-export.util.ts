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

