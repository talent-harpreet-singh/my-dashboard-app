

// Main Component
export { DynamicTableComponent } from './dynamic-table.component';

// Cell Component
export { TableCellComponent } from './table-cell/table-cell.component';

// Re-export types for convenience
export type {
  // Field Types
  TableFieldType,
  CellAlignment,
  SortDirection,
  
  // Column Config
  RadioOption,
  ComputedFieldConfig,
  CustomRendererConfig,
  VisibilityCondition,
  CellStyleConfig,
  TableFieldValidation,
  DynamicTableColumn,
  
  // Row Config
  DynamicTableRowConfig,
  
  // Actions
  TableAction,
  ActionsColumnConfig,
  
  // Table Config
  PaginationConfig,
  SelectionConfig,
  DynamicTableConfig,
  
  // Events
  CellChangeEvent,
  RowChangeEvent,
  TableActionEvent,
  ValidationError,
  TableValidationResult,
  
  // Helper Types
  TableRowData,
  DefaultRowFactory
} from '../../../models/dynamic-table.model';
