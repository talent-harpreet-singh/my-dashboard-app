

import { FieldValidation, SelectOption } from './form-model';


export type TableFieldType = 
  | 'text'
  | 'number'
  | 'date'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'readonly'
  | 'computed'
  | 'custom';


export type CellAlignment = 'left' | 'center' | 'right';

export type SortDirection = 'asc' | 'desc' | null;

// ============================================================================
// COLUMN CONFIGURATION
// ============================================================================

/**
 * Radio button option configuration
 */
export interface RadioOption {
  value: string | number | boolean;
  label: string;
  disabled?: boolean;
}

/**
 * Computed field configuration
 */
export interface ComputedFieldConfig {
  /** Keys of columns to use in computation */
  dependsOn: string[];
  /** Computation function - receives row data, returns computed value */
  compute: (row: any) => any;
}

/**
 * Custom renderer configuration
 */
export interface CustomRendererConfig {
  /** Component type or template reference */
  component?: any;
  /** Template name for ng-template based rendering */
  templateName?: string;
  /** Additional props to pass to custom component */
  props?: Record<string, any>;
}

/**
 * Column visibility condition
 */
export interface VisibilityCondition {
  /** Field key to check */
  fieldKey: string;
  /** Operator for comparison */
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'in' | 'notIn';
  /** Value to compare against */
  value: any;
}

/**
 * Cell-level style configuration
 */
export interface CellStyleConfig {
  /** Static CSS class names */
  className?: string;
  /** Dynamic class based on value */
  conditionalClass?: {
    condition: (value: any, row: any) => boolean;
    trueClass: string;
    falseClass?: string;
  };
  /** Inline styles */
  styles?: Record<string, string>;
  /** Dynamic styles based on value */
  conditionalStyles?: (value: any, row: any) => Record<string, string>;
}

/**
 * Extended validation for table fields
 */
export interface TableFieldValidation extends FieldValidation {
  /** Custom validation function */
  customValidator?: (value: any, row: any, allRows: any[]) => string | null;
  /** Cross-field validation (e.g., endDate > startDate) */
  crossFieldValidation?: {
    relatedField: string;
    operator: 'greaterThan' | 'lessThan' | 'equals' | 'notEquals' | 'greaterThanOrEquals' | 'lessThanOrEquals';
    message: string;
  };
  /** Unique value constraint across all rows */
  unique?: boolean;
  uniqueMessage?: string;
  /** Async validation */
  asyncValidator?: (value: any, row: any) => Promise<string | null>;
}

/**
 * Main column configuration schema
 * 
 * @example
 * {
 *   key: "startDate",
 *   label: "Start Date",
 *   type: "date",
 *   required: true,
 *   className: "date-cell",
 *   validation: { required: true }
 * }
 */
export interface DynamicTableColumn {
  // ---- Core Properties ----
  /** Unique key matching the data field name */
  key: string;
  /** Display label for column header */
  label: string;
  /** Field type determines which input/display to render */
  type: TableFieldType;
  
  // ---- Layout & Sizing ----
  /** Column width (CSS value: px, %, rem, etc.) */
  width?: string;
  /** Minimum width */
  minWidth?: string;
  /** Maximum width */
  maxWidth?: string;
  /** Cell alignment */
  align?: CellAlignment;
  /** Whether column is resizable */
  resizable?: boolean;
  
  // ---- Display & Behavior ----
  /** Whether column is sortable */
  sortable?: boolean;
  /** Whether field is read-only */
  readonly?: boolean;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Whether column is hidden */
  hidden?: boolean;
  /** Visibility condition */
  visibleWhen?: VisibilityCondition;
  /** Placeholder text for inputs */
  placeholder?: string;
  /** Tooltip/title text */
  tooltip?: string;
  
  // ---- Type-specific Options ----
  /** Options for select/dropdown fields */
  options?: SelectOption[];
  /** Options for radio button fields */
  radioOptions?: RadioOption[];
  /** Configuration for computed fields */
  computedConfig?: ComputedFieldConfig;
  /** Configuration for custom renderers */
  customRenderer?: CustomRendererConfig;
  
  // ---- Number field specific ----
  /** Minimum value for number inputs */
  min?: number;
  /** Maximum value for number inputs */
  max?: number;
  /** Step value for number inputs */
  step?: number;
  
  // ---- Date field specific ----
  /** Date format for display */
  dateFormat?: string;
  /** Minimum date */
  minDate?: Date | string;
  /** Maximum date */
  maxDate?: Date | string;
  
  // ---- Validation ----
  /** Whether field is required */
  required?: boolean;
  /** Full validation configuration */
  validation?: TableFieldValidation;
  
  // ---- Styling ----
  /** CSS class for the column header */
  headerClassName?: string;
  /** CSS class for cell */
  className?: string;
  /** Advanced cell styling */
  cellStyle?: CellStyleConfig;
  
  // ---- Formatting & Display ----
  /** Formatter function for display value */
  formatter?: (value: any, row: any) => string;
  /** Parser function for converting input to data value */
  parser?: (displayValue: any) => any;
  /** Default value for new rows */
  defaultValue?: any;
  
  // ---- Events & Callbacks ----
  /** Callback when cell value changes */
  onChange?: (value: any, row: any, rowIndex: number) => void;
  /** Callback when cell receives focus */
  onFocus?: (row: any, rowIndex: number) => void;
  /** Callback when cell loses focus */
  onBlur?: (value: any, row: any, rowIndex: number) => void;
}

// ============================================================================
// ROW CONFIGURATION
// ============================================================================

/**
 * Row-level configuration
 */
export interface DynamicTableRowConfig {
  /** CSS class for the row */
  className?: string;
  /** Conditional row styling */
  conditionalClass?: (row: any, rowIndex: number) => string;
  /** Whether row is selectable */
  selectable?: boolean;
  /** Whether row is expandable */
  expandable?: boolean;
  /** Whether row is draggable for reordering */
  draggable?: boolean;
  /** Row-level validation */
  validation?: (row: any, allRows: any[]) => { valid: boolean; message?: string };
}

// ============================================================================
// TABLE ACTIONS
// ============================================================================

/**
 * Action button configuration
 */
export interface TableAction {
  /** Unique action key */
  key: string;
  /** Display label (optional for icon-only buttons) */
  label?: string;
  /** Material icon name */
  icon?: string;
  /** Button style variant */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  /** Position in action column */
  position?: 'left' | 'right';
  /** Whether action is disabled */
  disabled?: boolean | ((row: any) => boolean);
  /** Whether action is hidden */
  hidden?: boolean | ((row: any) => boolean);
  /** Confirmation before action */
  confirm?: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
  };
  /** Tooltip text */
  tooltip?: string;
}

/**
 * Actions column configuration
 */
export interface ActionsColumnConfig {
  /** Column header label */
  label?: string;
  /** Column width */
  width?: string;
  /** Position of actions column */
  position?: 'start' | 'end';
  /** Available actions */
  actions: TableAction[];
  /** Whether to show actions in a dropdown menu */
  dropdown?: boolean;
}

// ============================================================================
// TABLE CONFIGURATION
// ============================================================================

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  enabled: boolean;
  pageSize: number;
  pageSizeOptions?: number[];
  showFirstLastButtons?: boolean;
}

/**
 * Selection configuration
 */
export interface SelectionConfig {
  enabled: boolean;
  mode: 'single' | 'multiple';
  showCheckboxes?: boolean;
  preserveSelectionOnPageChange?: boolean;
}

/**
 * Main table configuration schema
 */
export interface DynamicTableConfig {
  // ---- Core Configuration ----
  /** Table title */
  title?: string;
  /** Column definitions */
  columns: DynamicTableColumn[];
  /** Row configuration */
  rowConfig?: DynamicTableRowConfig;
  
  // ---- Features ----
  /** Actions column configuration */
  actionsColumn?: ActionsColumnConfig;
  /** Enable adding new rows */
  allowAdd?: boolean;
  /** Enable row deletion */
  allowDelete?: boolean;
  /** Enable inline editing */
  editable?: boolean;
  /** Enable sorting */
  sortable?: boolean;
  /** Default sort column */
  defaultSortColumn?: string;
  /** Default sort direction */
  defaultSortDirection?: SortDirection;
  
  // ---- Pagination ----
  pagination?: PaginationConfig;
  
  // ---- Selection ----
  selection?: SelectionConfig;
  
  // ---- Export ----
  /** Enable export functionality */
  exportable?: boolean;
  /** Export file name */
  exportFileName?: string;
  
  // ---- Styling ----
  /** CSS class for the table */
  tableClassName?: string;
  /** Enable striped rows */
  striped?: boolean;
  /** Enable hover effect */
  hoverable?: boolean;
  /** Enable bordered style */
  bordered?: boolean;
  /** Compact/dense mode */
  compact?: boolean;
  
  // ---- Responsive ----
  /** Responsive mode for mobile */
  responsiveMode?: 'scroll' | 'stack' | 'collapse';
  /** Breakpoint for responsive mode */
  responsiveBreakpoint?: number;
  
  // ---- Empty State ----
  /** Message when no data */
  emptyMessage?: string;
  /** Custom empty state template name */
  emptyTemplate?: string;
  
  // ---- Loading ----
  /** Loading indicator type */
  loadingType?: 'spinner' | 'skeleton' | 'overlay';
}

// ============================================================================
// EVENT INTERFACES
// ============================================================================

/**
 * Cell change event
 */
export interface CellChangeEvent {
  key: string;
  value: any;
  previousValue: any;
  row: any;
  rowIndex: number;
}

/**
 * Row change event
 */
export interface RowChangeEvent {
  row: any;
  rowIndex: number;
  changes: Record<string, { previousValue: any; newValue: any }>;
}

/**
 * Action event
 */
export interface TableActionEvent {
  action: string;
  row: any;
  rowIndex: number;
}

/**
 * Validation error
 */
export interface ValidationError {
  key: string;
  rowIndex: number;
  message: string;
  type: 'field' | 'row' | 'cross-field';
}

/**
 * Table validation result
 */
export interface TableValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Type-safe row data with dynamic keys
 */
export type TableRowData<T = any> = T & {
  _id?: string | number;
  _selected?: boolean;
  _expanded?: boolean;
  _dirty?: boolean;
  _errors?: Record<string, string>;
};

/**
 * Factory function type for creating default row
 */
export type DefaultRowFactory<T = any> = () => T;

