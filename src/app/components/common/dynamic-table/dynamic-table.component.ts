
 */
import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  OnInit, 
  OnChanges, 
  SimpleChanges,
  HostListener,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { 
  DynamicTableConfig, 
  DynamicTableColumn,
  CellChangeEvent,
  RowChangeEvent,
  TableActionEvent,
  ValidationError,
  TableValidationResult,
  SortDirection,
  TableRowData
} from '../../../models/dynamic-table.model';
import { TableCellComponent } from './table-cell/table-cell.component';
import { TableValidationService } from '../../../services/table-validation.service';
import { exportTableToExcel } from '../../../utils/excel-export.util';

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatIconModule,
    TableCellComponent
  ],
  template: `
    <div 
      class="dynamic-table-container"
      [class.bordered]="config.bordered"
      [class.compact]="config.compact"
      [class.dynamic-table-stacked]="isStackedView">
      
      <!-- Table Header -->
      <div class="dynamic-table-header" *ngIf="config.title || config.allowAdd || config.exportable">
        <div>
          <h3 class="dynamic-table-title" *ngIf="config.title">{{ config.title }}</h3>
          <div class="dynamic-table-subtitle" *ngIf="showRecordCount">
            Showing {{ displayData.length }} of {{ data.length }} records
          </div>
        </div>
        <div class="dynamic-table-actions">
          <button 
            *ngIf="config.allowAdd" 
            class="dt-header-btn dt-header-btn-add"
            (click)="addRow()">
            <mat-icon>add</mat-icon>
            <span>Add</span>
          </button>
          <button 
            *ngIf="config.exportable" 
            class="dt-header-btn dt-header-btn-export"
            (click)="exportToExcel()">
            <mat-icon>file_download</mat-icon>
            <span>Export</span>
          </button>
        </div>
      </div>
      
      <!-- Table Wrapper -->
      <div class="dynamic-table-wrapper">
        <!-- Loading Overlay -->
        <div class="dt-loading-overlay" *ngIf="isLoading">
          <div class="dt-loading-spinner"></div>
          <span class="dt-loading-text">Loading...</span>
        </div>
        
        <!-- Main Table -->
        <table 
          class="dynamic-table"
          [id]="tableId"
          [class.striped]="config.striped !== false"
          [class.hoverable]="config.hoverable !== false">
          
          <!-- Table Head -->
          <thead>
            <tr>
              <!-- Selection Column -->
              <th *ngIf="config.selection?.enabled && config.selection?.showCheckboxes" class="dt-cell-center" style="width: 50px;">
                <input 
                  *ngIf="config.selection?.mode === 'multiple'"
                  type="checkbox"
                  [checked]="isAllSelected"
                  [indeterminate]="isPartiallySelected"
                  (change)="toggleSelectAll($event)"
                />
              </th>
              
              <!-- Data Columns -->
              <ng-container *ngFor="let column of visibleColumns">
                <th 
                  [class.sortable]="column.sortable || config.sortable"
                  [class.dt-cell-left]="column.align === 'left'"
                  [class.dt-cell-center]="column.align === 'center'"
                  [class.dt-cell-right]="column.align === 'right'"
                  [style.width]="column.width"
                  [style.minWidth]="column.minWidth"
                  [style.maxWidth]="column.maxWidth"
                  [class]="column.headerClassName || ''"
                  (click)="onHeaderClick(column)">
                  <div class="dt-header-content">
                    <span>
                      {{ column.label }}
                      <span *ngIf="column.required" class="dt-required-indicator">*</span>
                    </span>
                    <span *ngIf="(column.sortable || config.sortable) && sortColumn === column.key" class="dt-sort-icon">
                      {{ sortDirection === 'asc' ? '▲' : '▼' }}
                    </span>
                  </div>
                </th>
              </ng-container>
              
              <!-- Actions Column -->
              <th *ngIf="config.actionsColumn" 
                  [style.width]="config.actionsColumn.width || '120px'"
                  class="dt-cell-center">
                {{ config.actionsColumn.label || 'Actions' }}
              </th>
            </tr>
          </thead>
          
          <!-- Table Body -->
          <tbody>
            <tr 
              *ngFor="let row of displayData; let rowIndex = index; trackBy: trackByFn"
              [class.dt-row-error]="hasRowErrors(rowIndex)"
              [class]="getRowClass(row, rowIndex)">
              
              <!-- Selection Cell -->
              <td *ngIf="config.selection?.enabled && config.selection?.showCheckboxes" class="dt-cell-center">
                <input 
                  type="checkbox"
                  [checked]="row._selected"
                  (change)="toggleRowSelection(row, rowIndex)"
                />
              </td>
              
              <!-- Data Cells -->
              <ng-container *ngFor="let column of visibleColumns">
                <td 
                  [attr.data-label]="column.label"
                  [class]="getCellClass(column)"
                  [style.width]="column.width"
                  [style.minWidth]="column.minWidth"
                  [style.maxWidth]="column.maxWidth">
                  <app-table-cell
                    [column]="column"
                    [value]="row[column.key]"
                    [row]="row"
                    [rowIndex]="rowIndex"
                    [hasError]="hasCellError(column.key, rowIndex)"
                    [errorMessage]="getCellError(column.key, rowIndex)"
                    [showError]="showValidationErrors"
                    (valueChange)="onCellChange(column.key, $event, row, rowIndex)"
                  ></app-table-cell>
                </td>
              </ng-container>
              
              <!-- Actions Cell -->
              <td *ngIf="config.actionsColumn" class="dt-actions-cell">
                <ng-container *ngFor="let action of config.actionsColumn.actions">
                  <button
                    *ngIf="!isActionHidden(action, row)"
                    class="dt-action-btn"
                    [class.dt-action-btn-icon]="action.icon && !action.label"
                    [class.dt-action-btn-primary]="action.variant === 'primary'"
                    [class.dt-action-btn-secondary]="action.variant === 'secondary'"
                    [class.dt-action-btn-success]="action.variant === 'success'"
                    [class.dt-action-btn-danger]="action.variant === 'danger'"
                    [class.dt-action-btn-warning]="action.variant === 'warning'"
                    [disabled]="isActionDisabled(action, row)"
                    [title]="action.tooltip || action.label || ''"
                    (click)="onActionClick(action.key, row, rowIndex)">
                    <mat-icon *ngIf="action.icon">{{ action.icon }}</mat-icon>
                    <span *ngIf="action.label">{{ action.label }}</span>
                  </button>
                </ng-container>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty State -->
        <div *ngIf="displayData.length === 0 && !isLoading" class="dt-empty-state">
          <div class="dt-empty-icon">📊</div>
          <p class="dt-empty-message">{{ config.emptyMessage || 'No data available' }}</p>
          <button 
            *ngIf="config.allowAdd" 
            class="dt-action-btn dt-action-btn-primary dt-empty-action"
            (click)="addRow()">
            <mat-icon>add</mat-icon>
            Add First Row
          </button>
        </div>
      </div>
      
      <!-- Table Footer -->
      <div class="dynamic-table-footer" *ngIf="showFooter">
        <div class="dt-footer-info">
          <span *ngIf="validationErrors.length > 0" class="dt-validation-error">
            <mat-icon>warning</mat-icon>
            {{ validationErrors.length }} validation error(s)
          </span>
          <span *ngIf="validationErrors.length === 0 && data.length > 0">
            {{ data.length }} row(s)
          </span>
        </div>
        <div class="dt-footer-actions">
          <ng-content select="[slot=footer-actions]"></ng-content>
        </div>
      </div>
    </div>
  `
})
export class DynamicTableComponent implements OnInit, OnChanges {
  // ============================================================================
  // INPUTS
  // ============================================================================
  
  /** Table configuration schema */
  @Input() config!: DynamicTableConfig;
  
  /** Table data array */
  @Input() data: TableRowData[] = [];
  
  /** Custom table ID for export */
  @Input() tableId: string = 'dynamic-table-' + Math.random().toString(36).substr(2, 9);
  
  /** Show loading state */
  @Input() isLoading: boolean = false;
  
  /** Show validation errors inline */
  @Input() showValidationErrors: boolean = true;
  
  /** Show record count in header */
  @Input() showRecordCount: boolean = true;
  
  /** Show footer section */
  @Input() showFooter: boolean = true;
  
  /** Factory function for creating new rows */
  @Input() newRowFactory?: () => any;
  
  // ============================================================================
  // OUTPUTS
  // ============================================================================
  
  /** Emits when data changes */
  @Output() dataChange = new EventEmitter<any[]>();
  
  /** Emits when a cell value changes */
  @Output() cellChange = new EventEmitter<CellChangeEvent>();
  
  /** Emits when a row changes */
  @Output() rowChange = new EventEmitter<RowChangeEvent>();
  
  /** Emits when an action button is clicked */
  @Output() actionClick = new EventEmitter<TableActionEvent>();
  
  /** Emits when a row is added */
  @Output() rowAdd = new EventEmitter<{ row: any; index: number }>();
  
  /** Emits when a row is deleted */
  @Output() rowDelete = new EventEmitter<{ row: any; index: number }>();
  
  /** Emits when selection changes */
  @Output() selectionChange = new EventEmitter<any[]>();
  
  /** Emits validation result */
  @Output() validationChange = new EventEmitter<TableValidationResult>();
  
  /** Emits when sort changes */
  @Output() sortChange = new EventEmitter<{ column: string; direction: SortDirection }>();
  
  // ============================================================================
  // INTERNAL STATE
  // ============================================================================
  
  displayData: TableRowData[] = [];
  sortColumn: string = '';
  sortDirection: SortDirection = null;
  validationErrors: ValidationError[] = [];
  isStackedView: boolean = false;
  
  constructor(
    private validationService: TableValidationService,
    private cdr: ChangeDetectorRef
  ) {}
  
  // ============================================================================
  // LIFECYCLE
  // ============================================================================
  
  ngOnInit(): void {
    this.initializeTable();
    this.checkResponsiveMode();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.initializeData();
    }
    if (changes['config']) {
      this.initializeTable();
    }
  }
  
  @HostListener('window:resize')
  onResize(): void {
    this.checkResponsiveMode();
  }
  
  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  
  private initializeTable(): void {
    if (!this.config) return;
    
    // Apply default sort if configured
    if (this.config.defaultSortColumn) {
      this.sortColumn = this.config.defaultSortColumn;
      this.sortDirection = this.config.defaultSortDirection || 'asc';
    }
    
    this.initializeData();
  }
  
  private initializeData(): void {
    // Clone data to avoid mutation
    this.displayData = this.data.map((row, index) => ({
      ...row,
      _id: row._id ?? index
    }));
    
    // Apply sorting if active
    if (this.sortColumn && this.sortDirection) {
      this.applySorting();
    }
    
    // Validate if needed
    if (this.showValidationErrors) {
      this.validateAll();
    }
  }
  
  private checkResponsiveMode(): void {
    if (this.config?.responsiveMode === 'stack') {
      const breakpoint = this.config.responsiveBreakpoint || 768;
      this.isStackedView = window.innerWidth < breakpoint;
    }
  }
  
  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================
  
  get visibleColumns(): DynamicTableColumn[] {
    return this.config.columns.filter(col => {
      if (col.hidden) return false;
      
      // Check visibility condition if defined
      if (col.visibleWhen) {
        return this.evaluateVisibility(col.visibleWhen);
      }
      
      return true;
    });
  }
  
  get isAllSelected(): boolean {
    return this.displayData.length > 0 && 
           this.displayData.every(row => row._selected);
  }
  
  get isPartiallySelected(): boolean {
    const selectedCount = this.displayData.filter(row => row._selected).length;
    return selectedCount > 0 && selectedCount < this.displayData.length;
  }
  
  get selectedRows(): any[] {
    return this.displayData.filter(row => row._selected);
  }
  
  // ============================================================================
  // CELL HANDLING
  // ============================================================================
  
  onCellChange(key: string, value: any, row: any, rowIndex: number): void {
    const previousValue = row[key];
    
    // Update the row data
    row[key] = value;
    row._dirty = true;
    
    // Update display data
    this.displayData[rowIndex] = { ...row };
    
    // Emit cell change event
    const cellEvent: CellChangeEvent = {
      key,
      value,
      previousValue,
      row,
      rowIndex
    };
    this.cellChange.emit(cellEvent);
    
    // Emit data change
    this.dataChange.emit(this.displayData);
    
    // Re-validate the row
    if (this.showValidationErrors) {
      this.validateRow(rowIndex);
    }
    
    this.cdr.detectChanges();
  }
  
  // ============================================================================
  // SORTING
  // ============================================================================
  
  onHeaderClick(column: DynamicTableColumn): void {
    if (!column.sortable && !this.config.sortable) return;
    
    if (this.sortColumn === column.key) {
      // Toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }
    
    this.applySorting();
    this.sortChange.emit({ column: this.sortColumn, direction: this.sortDirection });
  }
  
  private applySorting(): void {
    if (!this.sortColumn || !this.sortDirection) return;
    
    this.displayData.sort((a, b) => {
      const aVal = a[this.sortColumn];
      const bVal = b[this.sortColumn];
      
      // Handle null/undefined
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      
      // Compare
      let comparison = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }
  
  // ============================================================================
  // ROW OPERATIONS
  // ============================================================================
  
  addRow(): void {
    const newRow = this.createNewRow();
    const index = this.displayData.length;
    
    this.displayData.push(newRow);
    this.data.push(newRow);
    
    this.rowAdd.emit({ row: newRow, index });
    this.dataChange.emit(this.displayData);
  }
  
  deleteRow(rowIndex: number): void {
    const row = this.displayData[rowIndex];
    
    this.displayData.splice(rowIndex, 1);
    this.data.splice(rowIndex, 1);
    
    // Remove related validation errors
    this.validationErrors = this.validationErrors.filter(e => e.rowIndex !== rowIndex);
    
    // Adjust row indices for remaining errors
    this.validationErrors = this.validationErrors.map(e => ({
      ...e,
      rowIndex: e.rowIndex > rowIndex ? e.rowIndex - 1 : e.rowIndex
    }));
    
    this.rowDelete.emit({ row, index: rowIndex });
    this.dataChange.emit(this.displayData);
  }
  
  private createNewRow(): any {
    // Use factory if provided
    if (this.newRowFactory) {
      return { ...this.newRowFactory(), _id: Date.now() };
    }
    
    // Create from column defaults
    const newRow: any = { _id: Date.now() };
    
    for (const column of this.config.columns) {
      if (column.defaultValue !== undefined) {
        newRow[column.key] = column.defaultValue;
      } else {
        // Set type-appropriate defaults
        switch (column.type) {
          case 'checkbox':
            newRow[column.key] = false;
            break;
          case 'number':
            newRow[column.key] = 0;
            break;
          default:
            newRow[column.key] = '';
        }
      }
    }
    
    return newRow;
  }
  
  // ============================================================================
  // SELECTION
  // ============================================================================
  
  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    
    this.displayData.forEach(row => {
      row._selected = checked;
    });
    
    this.selectionChange.emit(this.selectedRows);
  }
  
  toggleRowSelection(row: any, rowIndex: number): void {
    if (this.config.selection?.mode === 'single') {
      // Deselect all others
      this.displayData.forEach(r => r._selected = false);
    }
    
    row._selected = !row._selected;
    this.selectionChange.emit(this.selectedRows);
  }
  
  // ============================================================================
  // ACTIONS
  // ============================================================================
  
  onActionClick(actionKey: string, row: any, rowIndex: number): void {
    const action = this.config.actionsColumn?.actions.find(a => a.key === actionKey);
    
    // Handle built-in delete action
    if (actionKey === 'delete' && this.config.allowDelete) {
      if (action?.confirm) {
        // Show confirmation (you can customize this)
        if (confirm(action.confirm.message)) {
          this.deleteRow(rowIndex);
        }
      } else {
        this.deleteRow(rowIndex);
      }
      return;
    }
    
    // Emit for custom handling
    this.actionClick.emit({ action: actionKey, row, rowIndex });
  }
  
  isActionHidden(action: any, row: any): boolean {
    if (typeof action.hidden === 'function') {
      return action.hidden(row);
    }
    return action.hidden === true;
  }
  
  isActionDisabled(action: any, row: any): boolean {
    if (typeof action.disabled === 'function') {
      return action.disabled(row);
    }
    return action.disabled === true;
  }
  
  // ============================================================================
  // VALIDATION
  // ============================================================================
  
  validateAll(): TableValidationResult {
    const result = this.validationService.validateTable(
      this.displayData, 
      this.config.columns
    );
    
    this.validationErrors = result.errors;
    this.validationChange.emit(result);
    
    return result;
  }
  
  validateRow(rowIndex: number): void {
    const row = this.displayData[rowIndex];
    
    // Remove existing errors for this row
    this.validationErrors = this.validationErrors.filter(e => e.rowIndex !== rowIndex);
    
    // Validate and add new errors
    const rowErrors = this.validationService.validateRow(
      row, 
      rowIndex, 
      this.config.columns, 
      this.displayData
    );
    
    this.validationErrors.push(...rowErrors);
    
    // Emit validation change
    this.validationChange.emit({
      valid: this.validationErrors.length === 0,
      errors: this.validationErrors
    });
  }
  
  hasRowErrors(rowIndex: number): boolean {
    return this.validationErrors.some(e => e.rowIndex === rowIndex);
  }
  
  hasCellError(key: string, rowIndex: number): boolean {
    return this.validationErrors.some(e => e.key === key && e.rowIndex === rowIndex);
  }
  
  getCellError(key: string, rowIndex: number): string {
    return this.validationService.getCellError(key, rowIndex, this.validationErrors) || '';
  }
  
  // ============================================================================
  // EXPORT
  // ============================================================================
  
  exportToExcel(): void {
    const fileName = this.config.exportFileName || 'table-export.xlsx';
    const sheetName = this.config.title || 'Data';
    exportTableToExcel(this.tableId, fileName, sheetName);
  }
  
  // ============================================================================
  // HELPERS
  // ============================================================================
  
  trackByFn(index: number, row: any): any {
    return row._id ?? index;
  }
  
  getRowClass(row: any, rowIndex: number): string {
    const classes: string[] = [];
    
    if (this.config.rowConfig?.className) {
      classes.push(this.config.rowConfig.className);
    }
    
    if (this.config.rowConfig?.conditionalClass) {
      const conditionalClass = this.config.rowConfig.conditionalClass(row, rowIndex);
      if (conditionalClass) {
        classes.push(conditionalClass);
      }
    }
    
    return classes.join(' ');
  }
  
  getCellClass(column: DynamicTableColumn): string {
    const classes: string[] = [];
    
    if (column.className) {
      classes.push(column.className);
    }
    
    if (column.align) {
      classes.push(`dt-cell-${column.align}`);
    }
    
    return classes.join(' ');
  }
  
  private evaluateVisibility(condition: any): boolean {
    // Find the value to check (could be from first row or elsewhere)
    // This is a simplified version - extend as needed
    if (this.displayData.length === 0) return true;
    
    const firstRow = this.displayData[0];
    const value = firstRow[condition.fieldKey];
    
    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'notEquals':
        return value !== condition.value;
      case 'contains':
        return String(value).includes(String(condition.value));
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(value);
      case 'notIn':
        return Array.isArray(condition.value) && !condition.value.includes(value);
      default:
        return true;
    }
  }
}

