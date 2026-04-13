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
import { formatMmDdYyyy } from '../../utils/mm-dd-yyyy-date.util';

// Interface for Merchant Match data
export interface MerchantMatch {
  matchCharCount: number;
  startDate: string;
  endDate: string;
  status: string;
  userId: string;
  lastUpdatedDate: string;
}

@Component({
  selector: 'app-merchant-match-table',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicTableComponent],
  template: `
    <div class="detail-page-container">
      <!-- Page Header -->
      <div class="detail-page-header">
        <h2>Credit Matching Rules (Consumers)</h2>
      </div>
      
      <div class="detail-page-content">
        <!-- Consumer / Small Business Radio Toggle -->
        <div class="detail-radio-group">
          <label class="detail-radio-label">
            <input 
              type="radio" 
              name="businessType" 
              value="consumer" 
              [(ngModel)]="selectedBusinessType"
              (change)="onBusinessTypeChange()">
            Consumer
          </label>
          <label class="detail-radio-label">
            <input 
              type="radio" 
              name="businessType" 
              value="smallBusiness" 
              [(ngModel)]="selectedBusinessType"
              (change)="onBusinessTypeChange()">
            Small Business
          </label>
        </div>
        
        <!-- Dynamic Table -->
        <app-dynamic-table
          [config]="tableConfig"
          [data]="merchantData"
          [showValidationErrors]="true"
          [showRecordCount]="false"
          [showFooter]="false"
          [newRowFactory]="createNewRow"
          (dataChange)="onDataChange($event)"
          (cellChange)="onCellChange($event)"
          (actionClick)="onActionClick($event)"
          (validationChange)="onValidationChange($event)"
          (rowAdd)="onRowAdd($event)"
          (rowDelete)="onRowDelete($event)"
        ></app-dynamic-table>
      </div>
    </div>
  `
})
export class MerchantMatchTableComponent implements OnChanges {
  @Input() data: MerchantMatch[] = [];
  @Input() businessType: 'consumer' | 'smallBusiness' = 'consumer';
  
  @Output() dataChange = new EventEmitter<MerchantMatch[]>();
  @Output() businessTypeChange = new EventEmitter<'consumer' | 'smallBusiness'>();
  @Output() rowUpdate = new EventEmitter<{ row: MerchantMatch; index: number }>();
  @Output() rowReject = new EventEmitter<{ row: MerchantMatch; index: number }>();
  @Output() rowConfirm = new EventEmitter<{ row: MerchantMatch; index: number }>();
  
  selectedBusinessType: 'consumer' | 'smallBusiness' = 'consumer';
  merchantData: MerchantMatch[] = [];
  validationResult: TableValidationResult | null = null;
  
  // Table configuration
  tableConfig: DynamicTableConfig = {
    title: 'Merchant Match Character Count',
    
    // Enable features
    allowAdd: true,
    allowDelete: false,
    sortable: true,
    exportable: false,
    striped: true,
    hoverable: true,
    bordered: true,
    
    // Empty state
    emptyMessage: 'No merchant match records found. Click "Add" to create one.',
    
    // Column definitions matching the screenshot
    columns: [
      {
        key: 'matchCharCount',
        label: 'Match Char Count',
        type: 'number',
        width: '150px',
        align: 'left',
        sortable: true
      },
      {
        key: 'startDate',
        label: 'Start Date',
        type: 'date',
        width: '150px',
        sortable: true
      },
      {
        key: 'endDate',
        label: 'End Date',
        type: 'date',
        width: '150px',
        sortable: true
      },
      {
        key: 'status',
        label: 'Status',
        type: 'readonly',
        width: '100px',
        align: 'center',
        sortable: true
      },
      {
        key: 'userId',
        label: 'User Id',
        type: 'readonly',
        width: '120px',
        align: 'center',
        sortable: true
      },
      {
        key: 'lastUpdatedDate',
        label: 'Last Updated Date',
        type: 'readonly',
        width: '180px',
        sortable: true
      }
    ],
    
    // Actions column with row-level buttons
    actionsColumn: {
      label: '',
      width: '220px',
      actions: [
        {
          key: 'update',
          label: 'Update',
          variant: 'primary'
        },
        {
          key: 'reject',
          label: 'Reject',
          variant: 'secondary'
        },
        {
          key: 'confirm',
          label: 'Confirm',
          variant: 'success'
        }
      ]
    }
  };
  
  // Factory for creating new rows
  createNewRow = (): MerchantMatch => {
    return {
      matchCharCount: 0,
      startDate: formatMmDdYyyy(new Date()),
      endDate: '12-31-9999',
      status: 'P',
      userId: 'SYSTEM',
      lastUpdatedDate: this.formatDateTime(new Date()),
    };
  };
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.merchantData = [...this.data];
    }
    if (changes['businessType']) {
      this.selectedBusinessType = this.businessType;
    }
  }
  
  // Event handlers
  onBusinessTypeChange(): void {
    this.businessTypeChange.emit(this.selectedBusinessType);
  }
  
  onDataChange(data: any[]): void {
    this.merchantData = data;
    this.dataChange.emit(data as MerchantMatch[]);
  }
  
  onCellChange(event: CellChangeEvent): void {
    // Update timestamp when data changes
    if (event.key !== 'lastUpdatedDate') {
      event.row.lastUpdatedDate = this.formatDateTime(new Date());
    }
  }
  
  onActionClick(event: TableActionEvent): void {
    const row = event.row as MerchantMatch;
    
    switch (event.action) {
      case 'update':
        this.rowUpdate.emit({ row, index: event.rowIndex });
        break;
      case 'reject':
        this.rowReject.emit({ row, index: event.rowIndex });
        break;
      case 'confirm':
        this.rowConfirm.emit({ row, index: event.rowIndex });
        break;
    }
  }
  
  onValidationChange(result: TableValidationResult): void {
    this.validationResult = result;
  }
  
  onRowAdd(event: { row: any; index: number }): void {
    console.log('Row added:', event);
  }
  
  onRowDelete(event: { row: any; index: number }): void {
    console.log('Row deleted:', event);
  }
  
  // Helper methods
  private formatDateTime(date: Date): string {
    const dateStr = formatMmDdYyyy(date);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${dateStr} ${String(hour12).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
  }
}
