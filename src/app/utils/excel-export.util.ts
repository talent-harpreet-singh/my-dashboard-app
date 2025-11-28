import * as XLSX from 'xlsx';

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


export async function exportToExcel(options: ExcelExportOptions): Promise<ExcelExportResult> {
  const {
    fileName,
    sheetName = 'Sheet1',
    columns,
    data,
    freezeHeaderRow = true,
    compression = true,
    cellStyles = false,
    chunkSize = 1000,
    onProgress
  } = options;

  try {
    if (!data || data.length === 0) {
      return {
        success: false,
        error: 'No data to export'
      };
    }

    if (!columns || columns.length === 0) {
      return {
        success: false,
        error: 'No columns defined for export'
      };
    }

    const exportData: Array<Record<string, any>> = [];
    const totalRecords = data.length;

    for (let i = 0; i < totalRecords; i += chunkSize) {
      const chunk = data.slice(i, Math.min(i + chunkSize, totalRecords));
      
      const chunkData = chunk.map(row => {
        const exportRow: Record<string, any> = {};
        columns.forEach(col => {
          exportRow[col.header] = row[col.key] ?? '';
        });
        return exportRow;
      });

      exportData.push(...chunkData);
      
      if (onProgress) {
        const current = Math.min(i + chunkSize, totalRecords);
        onProgress({
          current,
          total: totalRecords,
          percentage: Math.round((current / totalRecords) * 100)
        });
      }
      
      if (i + chunkSize < totalRecords) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    const headers = columns.map(col => col.header);
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, {
      header: headers,
      skipHeader: false
    });

    const columnWidths = calculateColumnWidths(exportData, columns);
    worksheet['!cols'] = columnWidths;

    if (freezeHeaderRow) {
      worksheet['!freeze'] = {
        xSplit: 0,
        ySplit: 1,
        topLeftCell: 'A2',
        activePane: 'bottomLeft'
      };
    }

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const writeOptions: XLSX.WritingOptions = {
      bookType: 'xlsx',
      type: 'array',
      cellStyles,
      compression
    };

    const result = await downloadExcelFile(workbook, fileName, writeOptions, totalRecords);

    return {
      success: true,
      fileName
    };

  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred during export'
    };
  }
}

function calculateColumnWidths(
  exportData: Array<Record<string, any>>,
  columns: ExcelExportColumn[]
): Array<{ wch: number }> {
  const columnWidths: Array<{ wch: number }> = [];

  columns.forEach((col, index) => {
    const header = col.header;
    let maxWidth = col.minWidth || (header.length + 2);

    // Calculate max width in a single pass
    for (const row of exportData) {
      const cellValue = String(row[header] || '');
      maxWidth = Math.max(maxWidth, cellValue.length);
    }

    if (col.maxWidth) {
      maxWidth = Math.min(maxWidth, col.maxWidth);
    }
    if (col.width) {
      maxWidth = col.width;
    }

    columnWidths.push({ wch: maxWidth });
  });

  return columnWidths;
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

