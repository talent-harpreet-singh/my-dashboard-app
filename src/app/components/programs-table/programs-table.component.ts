import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Program } from '../../models/rule.model';
import { 
  DynamicTableComponent, 
  DynamicTableConfig,
  CellChangeEvent,
  TableActionEvent,
  TableValidationResult
} from '../common/dynamic-table';

@Component({
  selector: 'app-programs-table',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent],
  template: `
    <div
      class="programs-table-container"
      [style.--dt-primary]="headerBackgroundColor"
      [style.--dt-primary-dark]="headerBackgroundColor"
      [style.--dt-bg-light]="tableBackgroundColor">
      <app-dynamic-table
        [config]="tableConfig"
        [data]="programsData"
        [showValidationErrors]="true"
        [showRecordCount]="true"
        [newRowFactory]="createNewRow"
        (dataChange)="onDataChange($event)"
        (cellChange)="onCellChange($event)"
        (actionClick)="onActionClick($event)"
        (validationChange)="onValidationChange($event)"
        (rowAdd)="onRowAdd($event)"
        (rowDelete)="onRowDelete($event)"
      ></app-dynamic-table>
      
      <div class="programs-button-group">
        <button class="programs-btn programs-btn-update" (click)="updatePrograms()">
          Update
        </button>
        <button class="programs-btn programs-btn-reject" (click)="rejectChanges()">
          Reject
        </button>
        <button class="programs-btn programs-btn-confirm" (click)="confirmPrograms()">
          Confirm
        </button>
        <button class="programs-btn programs-btn-cancel" (click)="cancelEdit()">
          Cancel
        </button>
      </div>
    </div>
  `,
  styles: [`
    .programs-table-container {
      width: 100%;
    }
    
    .programs-button-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 16px;
      padding: 12px 0;
    }
    
    .programs-btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .programs-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    }
    
    .programs-btn-update {
      background: #1976d2;
      color: white;
    }
    
    .programs-btn-update:hover {
      background: #1565c0;
    }
    
    .programs-btn-reject {
      background: #d32f2f;
      color: white;
    }
    
    .programs-btn-reject:hover {
      background: #c62828;
    }
    
    .programs-btn-confirm {
      background: #388e3c;
      color: white;
    }
    
    .programs-btn-confirm:hover {
      background: #2e7d32;
    }
    
    .programs-btn-cancel {
      background: #757575;
      color: white;
    }
    
    .programs-btn-cancel:hover {
      background: #616161;
    }
  `]
})
export class ProgramsTableComponent implements OnChanges {
  @Input() programs: Program[] = [];
  @Input() headerBackgroundColor: string = '#1a4da0';
  @Input() tableBackgroundColor: string = '#e6f3ff';
  
  @Output() programsChange = new EventEmitter<Program[]>();
  @Output() update = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  
  programsData: Program[] = [];
  validationResult: TableValidationResult | null = null;
  
  // Table configuration
  tableConfig: DynamicTableConfig = {
    title: 'Programs Attached to This Promo',
    
    // Enable features
    allowAdd: true,
    allowDelete: true,
    sortable: true,
    exportable: true,
    striped: true,
    hoverable: true,
    bordered: true,
    
    // Export settings
    exportFileName: 'Programs.xlsx',
    
    // Empty state
    emptyMessage: 'No programs attached. Click "Add" to create one.',
    
    // Column definitions
    columns: [
      {
        key: 'programNumber',
        label: 'Program Number',
        type: 'text',
        width: '130px',
        placeholder: 'Enter program #',
        sortable: true
      },
      {
        key: 'legacyCode',
        label: 'Legacy Code',
        type: 'text',
        width: '120px',
        placeholder: 'Enter code',
        sortable: true
      },
      {
        key: 'description',
        label: 'Description',
        type: 'text',
        width: '200px',
        placeholder: 'Enter description',
        sortable: true
      },
      {
        key: 'startDate',
        label: 'Start Dt',
        type: 'date',
        width: '130px',
        placeholder: 'MM-DD-YYYY',
        sortable: true
      },
      {
        key: 'endDate',
        label: 'End Dt',
        type: 'date',
        width: '130px',
        placeholder: 'MM-DD-YYYY',
        sortable: true,
        validation: {
          crossFieldValidation: {
            relatedField: 'startDate',
            operator: 'greaterThanOrEquals',
            message: 'End date must be on or after start date'
          }
        }
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
        width: '100px',
        align: 'center',
        sortable: true
      },
      {
        key: 'lastUpdated',
        label: 'Last Updated',
        type: 'readonly',
        width: '150px',
        sortable: true
      },
      {
        key: 'delete',
        label: 'Check To Delete',
        type: 'checkbox',
        width: '120px',
        align: 'center',
        sortable: true
      }
    ]
  };
  
  // Factory for creating new rows
  createNewRow = (): Program => {
    return {
      programNumber: '',
      legacyCode: '',
      description: '',
      startDate: '01-01-0001',
      endDate: '12-31-9999',
      status: 'Pending',
      userId: 'ZKYSZI6',
      lastUpdated: new Date().toLocaleString(),
      delete: false
    };
  };
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['programs']) {
      this.programsData = [...this.programs];
    }
  }
  
  // Event handlers
  onDataChange(data: any[]): void {
    this.programsData = data;
    this.programsChange.emit(data as Program[]);
  }
  
  onCellChange(event: CellChangeEvent): void {
    // Update lastUpdated timestamp when any cell changes
    if (event.key !== 'lastUpdated') {
      event.row.lastUpdated = new Date().toLocaleString();
    }
  }
  
  onActionClick(event: TableActionEvent): void {
    console.log('Action clicked:', event);
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
  
  // Button actions
  updatePrograms(): void {
    this.update.emit();
    alert('Programs updated (locally).');
  }
  
  rejectChanges(): void {
    this.reject.emit();
    alert('Rejected changes (reset not implemented).');
  }
  
  confirmPrograms(): void {
    this.confirm.emit();
    alert('Programs confirmed!');
  }
  
  cancelEdit(): void {
    this.cancel.emit();
    alert('Canceled edits (UI only).');
  }
}
