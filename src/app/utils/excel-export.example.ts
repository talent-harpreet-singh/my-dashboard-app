
// import { exportToExcel, createColumnsFromTableConfig, ExcelExportOptions } from './excel-export.util';


// export async function example1_BasicTableExport(
//   tableColumns: Array<{ key: string; header: string; width?: string }>,
//   tableData: any[],
//   fileName: string
// ) {
//   const columns = createColumnsFromTableConfig(tableColumns);
  
//   const options: ExcelExportOptions = {
//     fileName: fileName,
//     sheetName: 'Data Export',
//     columns: columns,
//     data: tableData
//   };

//   const result = await exportToExcel(options);
  
//   if (!result.success) {
//     console.error('Export failed:', result.error);
//   }
// }

// /**
//  * Example 2: Custom column configuration
//  * Use this when you need custom column widths or headers different from table
//  */
// export async function example2_CustomColumns(
//   data: any[],
//   fileName: string
// ) {
//   const options: ExcelExportOptions = {
//     fileName: fileName,
//     sheetName: 'Custom Export',
//     columns: [
//       { key: 'id', header: 'ID', width: 10, minWidth: 8 },
//       { key: 'name', header: 'Full Name', maxWidth: 50, minWidth: 20 },
//       { key: 'email', header: 'Email Address', maxWidth: 40 },
//       { key: 'status', header: 'Status', width: 15 }
//     ],
//     data: data,
//     freezeHeaderRow: true,
//     compression: true
//   };

//   await exportToExcel(options);
// }

// /**
//  * Example 3: With progress tracking
//  * Use this for large datasets where you want to show progress to users
//  */
// export async function example3_WithProgress(
//   data: any[],
//   fileName: string,
//   onProgressUpdate: (percentage: number) => void
// ) {
//   const columns = [
//     { key: 'promoId', header: 'Promo ID' },
//     { key: 'name', header: 'Name' },
//     { key: 'status', header: 'Status' }
//   ];

//   const options: ExcelExportOptions = {
//     fileName: fileName,
//     columns: columns,
//     data: data,
//     onProgress: (progress) => {
//       // Update your UI component with progress
//       onProgressUpdate(progress.percentage);
//       console.log(`Exporting: ${progress.current}/${progress.total} (${progress.percentage}%)`);
//     }
//   };

//   await exportToExcel(options);
// }

// /**
//  * Example 4: Component integration pattern
//  * Use this pattern in your Angular components
//  */
// export class ExampleComponent {
//   isExporting = false;
//   exportFileName = 'MyExport.xlsx';
  
//   tableConfig = {
//     columns: [
//       { key: 'id', header: 'ID', width: '100px' },
//       { key: 'name', header: 'Name', sortable: true },
//       { key: 'status', header: 'Status', width: '120px' }
//     ]
//   };

//   tableData = [
//     { id: 1, name: 'Item 1', status: 'Active' },
//     { id: 2, name: 'Item 2', status: 'Inactive' }
//   ];

//   async handleExport() {
//     if (this.isExporting) return;

//     try {
//       this.isExporting = true;

//       // Allow UI to update
//       await new Promise(resolve => setTimeout(resolve, 100));

//       const columns = createColumnsFromTableConfig(this.tableConfig.columns);

//       const options: ExcelExportOptions = {
//         fileName: this.exportFileName,
//         sheetName: 'My Data',
//         columns: columns,
//         data: this.tableData,
//         onProgress: (progress) => {
//           // Optional: Update progress indicator
//           console.log(`Progress: ${progress.percentage}%`);
//         }
//       };

//       const result = await exportToExcel(options);

//       if (!result.success) {
//         alert(`Export failed: ${result.error}`);
//       }

//     } catch (error) {
//       console.error('Export error:', error);
//       alert('An error occurred during export');
//     } finally {
//       this.isExporting = false;
//     }
//   }
// }

// /**
//  * Example 5: Large dataset with optimized settings
//  */
// export async function example5_LargeDataset(
//   data: any[],
//   fileName: string
// ) {
//   const options: ExcelExportOptions = {
//     fileName: fileName,
//     columns: [
//       { key: 'id', header: 'ID' },
//       { key: 'data', header: 'Data' }
//     ],
//     data: data,
//     chunkSize: 2000, // Larger chunks for better performance
//     compression: true,
//     cellStyles: false // Disable styles for faster export
//   };

//   await exportToExcel(options);
// }

// /**
//  * Example 6: Multiple sheets export (future enhancement)
//  * Note: This requires extending the utility function
//  */
// export async function example6_MultipleSheets(
//   datasets: Array<{ name: string; columns: any[]; data: any[] }>,
//   fileName: string
// ) {
//   // This would require extending the utility to support multiple sheets
//   // For now, export each dataset separately
//   for (const dataset of datasets) {
//     const options: ExcelExportOptions = {
//       fileName: `${fileName}_${dataset.name}.xlsx`,
//       sheetName: dataset.name,
//       columns: dataset.columns,
//       data: dataset.data
//     };
//     await exportToExcel(options);
//   }
// }

