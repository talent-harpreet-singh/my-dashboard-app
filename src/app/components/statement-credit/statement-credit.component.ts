import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  DynamicTableComponent, 
  DynamicTableConfig,
  CellChangeEvent,
  TableActionEvent,
  TableValidationResult
} from '../common/dynamic-table';

// Interface for Statement Credit data
export interface StatementCreditRow {
  endPoint: number;
  standardPercent: number;
  balancePercent: number;
}

export interface StatementCreditData {
  lastUpdatedDate: string;
  status: string;
  userId: string;
  notes: string;
  statementCreditFulfillment: boolean;
  calculationType: 'percent' | 'amount';
  rows: StatementCreditRow[];
}

@Component({
  selector: 'app-statement-credit',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicTableComponent],
  template: `
    <div class="detail-page-container">
      <!-- Page Header -->
      <div class="detail-page-header">
        <h2>Statement Credit Configuration</h2>
      </div>
      
      <div class="detail-page-content">
        <!-- Info Row -->
        <div class="sc-info-row">
          <div class="sc-info-item">
            <span class="sc-info-label">Last Updated Date:</span>
            <span class="sc-info-value">{{ data.lastUpdatedDate }}</span>
          </div>
          <div class="sc-info-item">
            <span class="sc-info-label">Status:</span>
            <span class="sc-info-value">{{ data.status }}</span>
          </div>
          <div class="sc-info-item">
            <span class="sc-info-label">User Id:</span>
            <span class="sc-info-value">{{ data.userId }}</span>
          </div>
        </div>
        
        <!-- Notes and Checkbox Row -->
        <div class="sc-notes-row">
          <div class="sc-notes-section">
            <label class="detail-label">Notes:</label>
            <textarea 
              class="detail-textarea"
              [(ngModel)]="data.notes"
              rows="4"
              placeholder="Enter notes..."
            ></textarea>
          </div>
          <div class="sc-checkbox-section">
            <label class="detail-checkbox-label">
              Statement<br>Credit<br>Fulfillment:
              <input 
                type="checkbox" 
                [(ngModel)]="data.statementCreditFulfillment"
                (change)="onCheckboxChange()"
              >
            </label>
          </div>
        </div>
        
        <!-- Calculation Type Radio -->
        <div class="detail-radio-group sc-radio-group">
          <label class="detail-radio-label">
            <input 
              type="radio" 
              name="calculationType" 
              value="percent" 
              [(ngModel)]="data.calculationType"
              (change)="onCalculationTypeChange()">
            Percent
          </label>
          <label class="detail-radio-label">
            <input 
              type="radio" 
              name="calculationType" 
              value="amount" 
              [(ngModel)]="data.calculationType"
              (change)="onCalculationTypeChange()">
            Amount
          </label>
        </div>
        
        <!-- Dynamic Table -->
        <app-dynamic-table
          [config]="tableConfig"
          [data]="tableData"
          [showValidationErrors]="true"
          [showRecordCount]="false"
          [showFooter]="false"
          [newRowFactory]="createNewRow"
          (dataChange)="onDataChange($event)"
          (cellChange)="onCellChange($event)"
          (validationChange)="onValidationChange($event)"
        ></app-dynamic-table>
        
        <!-- Action Buttons -->
        <div class="detail-button-group">
          <button class="detail-btn detail-btn-primary" (click)="onUpdate()">
            Update
          </button>
          <button class="detail-btn detail-btn-secondary" (click)="onSaveAsClone()">
            SaveAs / Clone
          </button>
          <button class="detail-btn detail-btn-danger" (click)="onCancel()">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sc-info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f8fbff;
      border: 1px solid #cce0ff;
      border-radius: 4px;
      margin-bottom: 16px;
    }
    
    .sc-info-item {
      display: flex;
      gap: 8px;
    }
    
    .sc-info-label {
      font-weight: 600;
      color: #003366;
    }
    
    .sc-info-value {
      color: #002041;
    }
    
    .sc-notes-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      margin-bottom: 16px;
    }
    
    .sc-notes-section {
      display: flex;
      gap: 12px;
      flex: 1;
    }
    
    .sc-checkbox-section {
      display: flex;
      align-items: center;
      background: #f2f7ff;
      padding: 16px;
      border-radius: 6px;
      border: 1px solid #cce0ff;
    }
    
    .sc-radio-group {
      background: #8090a8;
      border: none;
    }
  `]
})
export class StatementCreditComponent implements OnChanges {
  @Input() data: StatementCreditData = {
    lastUpdatedDate: '',
    status: '',
    userId: '',
    notes: '',
    statementCreditFulfillment: false,
    calculationType: 'percent',
    rows: []
  };
  
  @Output() dataChange = new EventEmitter<StatementCreditData>();
  @Output() update = new EventEmitter<StatementCreditData>();
  @Output() saveAsClone = new EventEmitter<StatementCreditData>();
  @Output() cancel = new EventEmitter<void>();
  
  tableData: StatementCreditRow[] = [];
  validationResult: TableValidationResult | null = null;
  
  // Table configuration
  tableConfig: DynamicTableConfig = {
    title: '',
    
    // Enable features
    allowAdd: true,
    allowDelete: true,
    sortable: true,
    exportable: false,
    striped: true,
    hoverable: true,
    bordered: true,
    
    // Empty state
    emptyMessage: 'No data available. Click "Add" to create a row.',
    
    // Column definitions matching the screenshot
    columns: [
      {
        key: 'endPoint',
        label: 'End Point',
        type: 'number',
        width: '33%',
        align: 'right',
        sortable: true
      },
      {
        key: 'standardPercent',
        label: 'Standard %',
        type: 'number',
        width: '33%',
        align: 'right',
        sortable: true
      },
      {
        key: 'balancePercent',
        label: 'Balance %',
        type: 'number',
        width: '33%',
        align: 'right',
        sortable: true
      }
    ]
  };
  
  // Factory for creating new rows
  createNewRow = (): StatementCreditRow => {
    return {
      endPoint: 0,
      standardPercent: 100,
      balancePercent: 100
    };
  };
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.tableData = [...this.data.rows];
      this.updateColumnLabels();
    }
  }
  
  private updateColumnLabels(): void {
    const suffix = this.data.calculationType === 'percent' ? '%' : '';
    this.tableConfig = {
      ...this.tableConfig,
      columns: this.tableConfig.columns.map(col => {
        if (col.key === 'standardPercent') {
          return { ...col, label: `Standard ${suffix}` };
        }
        if (col.key === 'balancePercent') {
          return { ...col, label: `Balance ${suffix}` };
        }
        return col;
      })
    };
  }
  
  // Event handlers
  onCalculationTypeChange(): void {
    this.updateColumnLabels();
    this.emitDataChange();
  }
  
  onCheckboxChange(): void {
    this.emitDataChange();
  }
  
  onDataChange(data: any[]): void {
    this.tableData = data;
    this.data.rows = data as StatementCreditRow[];
    this.emitDataChange();
  }
  
  onCellChange(event: CellChangeEvent): void {
    console.log('Cell changed:', event);
  }
  
  onValidationChange(result: TableValidationResult): void {
    this.validationResult = result;
  }
  
  private emitDataChange(): void {
    this.dataChange.emit({ ...this.data, rows: this.tableData });
  }
  
  // Button actions
  onUpdate(): void {
    this.update.emit({ ...this.data, rows: this.tableData });
    alert('Configuration updated successfully!');
  }
  
  onSaveAsClone(): void {
    this.saveAsClone.emit({ ...this.data, rows: this.tableData });
    alert('Configuration saved as clone!');
  }
  
  onCancel(): void {
    this.cancel.emit();
    alert('Changes cancelled.');
  }
}
