
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  DynamicTableComponent, 
  DynamicTableConfig,
  CellChangeEvent,
  TableActionEvent,
  TableValidationResult
} from '../common/dynamic-table';

@Component({
  selector: 'app-dynamic-table-demo',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent],
  template: `
    <div class="detail-page-container">
      <div class="detail-page-header">
        <h2>Dynamic Table Demo</h2>
      </div>
      
      <!-- // This is how we use anywhere need to use dynamic table. -->
      <div class="detail-page-content">
        <app-dynamic-table
          [config]="tableConfig"
          [data]="tableData"
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
        
        <!-- Action Buttons using global detail-page styles -->
        <div class="detail-button-group">
          <button class="detail-btn detail-btn-primary" (click)="validateTable()">
            Validate All
          </button>
          <button class="detail-btn detail-btn-secondary" (click)="resetData()">
            Reset Data
          </button>
          <button class="detail-btn detail-btn-success" (click)="saveData()">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  `
})
export class DynamicTableDemoComponent implements OnInit {
  
  tableConfig: DynamicTableConfig = {
    title: 'Employee Records',
    
    // Enable features
    allowAdd: true,
    allowDelete: true,
    sortable: true,
    exportable: true,
    striped: true,
    hoverable: true,
    bordered: true,
    
    // Responsive mode
    responsiveMode: 'scroll',
    responsiveBreakpoint: 768,
    
    // Empty state
    emptyMessage: 'No employee records found. Click "Add" to create one.',
    
    // Export settings
    exportFileName: 'EmployeeRecords.xlsx',
    
    // Column definitions - showcasing ALL field types
    columns: [
      // TEXT field
      {
        key: 'employeeId',
        label: 'Employee ID',
        type: 'text',
        required: true,
        width: '120px',
        placeholder: 'E.g., EMP001',
        validation: {
          pattern: '^EMP[0-9]{3}$',
          message: 'Must be in format EMP###',
          unique: true,
          uniqueMessage: 'Employee ID must be unique'
        }
      },
      
      // TEXT field
      {
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        required: true,
        width: '180px',
        placeholder: 'Enter full name',
        validation: {
          min: 3,
          max: 50,
          message: 'Name must be 3-50 characters'
        }
      },
      
      // NUMBER field
      {
        key: 'age',
        label: 'Age',
        type: 'number',
        width: '80px',
        min: 18,
        max: 70,
        align: 'center',
        validation: {
          min: 18,
          max: 70,
          message: 'Age must be between 18-70'
        }
      },
      
      // SELECT/DROPDOWN field
      {
        key: 'department',
        label: 'Department',
        type: 'select',
        required: true,
        width: '150px',
        placeholder: 'Select...',
        options: [
          { value: 'engineering', label: 'Engineering' },
          { value: 'marketing', label: 'Marketing' },
          { value: 'sales', label: 'Sales' },
          { value: 'hr', label: 'Human Resources' },
          { value: 'finance', label: 'Finance' },
          { value: 'operations', label: 'Operations' }
        ]
      },
      
      // DATE field (Calendar Picker)
      {
        key: 'joinDate',
        label: 'Join Date',
        type: 'date',
        required: true,
        width: '150px',
        placeholder: 'MM-DD-YYYY',
        sortable: true
      },
      
      // DATE field (Calendar Picker) with cross-field validation
      {
        key: 'reviewDate',
        label: 'Next Review',
        type: 'date',
        width: '150px',
        placeholder: 'MM-DD-YYYY',
        validation: {
          crossFieldValidation: {
            relatedField: 'joinDate',
            operator: 'greaterThan',
            message: 'Review date must be after join date'
          }
        }
      },
      
      // NUMBER field (salary)
      {
        key: 'salary',
        label: 'Salary ($)',
        type: 'number',
        width: '120px',
        align: 'right',
        min: 30000,
        max: 500000,
        step: 1000,
        validation: {
          min: 30000,
          message: 'Minimum salary is $30,000'
        }
      },
      
      // RADIO field
      {
        key: 'employmentType',
        label: 'Type',
        type: 'radio',
        width: '180px',
        radioOptions: [
          { value: 'full-time', label: 'Full-Time' },
          { value: 'part-time', label: 'Part-Time' },
          { value: 'contract', label: 'Contract' }
        ]
      },
      
      // SELECT field (status)
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        width: '120px',
        align: 'center',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'onLeave', label: 'On Leave' },
          { value: 'terminated', label: 'Terminated' }
        ]
      },
      
      // CHECKBOX field
      {
        key: 'isManager',
        label: 'Manager',
        type: 'checkbox',
        width: '80px',
        align: 'center',
        defaultValue: false
      },
      
      // READONLY field
      {
        key: 'createdBy',
        label: 'Created By',
        type: 'readonly',
        width: '100px',
        align: 'center'
      },
      
      // CHECKBOX for deletion
      {
        key: 'markForDelete',
        label: 'Delete?',
        type: 'checkbox',
        width: '80px',
        align: 'center',
        defaultValue: false
      }
    ],
    
    // Actions column
    actionsColumn: {
      label: 'Actions',
      width: '100px',
      actions: [
        {
          key: 'edit',
          icon: 'edit',
          variant: 'primary',
          tooltip: 'Edit record'
        },
        {
          key: 'delete',
          icon: 'delete',
          variant: 'danger',
          tooltip: 'Delete record',
          confirm: {
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this record?'
          }
        }
      ]
    }
  };
  
  // Sample data
  tableData: any[] = [];
  
  // Validation result
  validationResult: TableValidationResult | null = null;
  
  // Factory function for new rows
  createNewRow = (): any => {
    return {
      employeeId: '',
      fullName: '',
      age: 25,
      department: '',
      joinDate: this.formatDate(new Date()),
      reviewDate: '',
      salary: 50000,
      employmentType: 'full-time',
      status: 'active',
      isManager: false,
      createdBy: 'System',
      markForDelete: false
    };
  };
  
  ngOnInit(): void {
    this.loadSampleData();
  }
  
  loadSampleData(): void {
    this.tableData = [
      {
        employeeId: 'EMP001',
        fullName: 'John Smith',
        age: 32,
        department: 'engineering',
        joinDate: '03-15-2020',
        reviewDate: '03-15-2025',
        salary: 95000,
        employmentType: 'full-time',
        status: 'active',
        isManager: true,
        createdBy: 'Admin',
        markForDelete: false
      },
      {
        employeeId: 'EMP002',
        fullName: 'Sarah Johnson',
        age: 28,
        department: 'marketing',
        joinDate: '07-01-2021',
        reviewDate: '07-01-2025',
        salary: 72000,
        employmentType: 'full-time',
        status: 'active',
        isManager: false,
        createdBy: 'Admin',
        markForDelete: false
      },
      {
        employeeId: 'EMP003',
        fullName: 'Michael Chen',
        age: 45,
        department: 'finance',
        joinDate: '01-10-2018',
        reviewDate: '01-10-2025',
        salary: 120000,
        employmentType: 'full-time',
        status: 'onLeave',
        isManager: true,
        createdBy: 'System',
        markForDelete: false
      },
      {
        employeeId: 'EMP004',
        fullName: 'Emily Davis',
        age: 35,
        department: 'hr',
        joinDate: '09-20-2019',
        reviewDate: '09-20-2025',
        salary: 85000,
        employmentType: 'full-time',
        status: 'active',
        isManager: false,
        createdBy: 'Admin',
        markForDelete: false
      },
      {
        employeeId: 'EMP005',
        fullName: 'Robert Wilson',
        age: 52,
        department: 'operations',
        joinDate: '05-05-2015',
        reviewDate: '',
        salary: 98000,
        employmentType: 'contract',
        status: 'terminated',
        isManager: false,
        createdBy: 'System',
        markForDelete: true
      }
    ];
  }
  
  // Event Handlers
  onDataChange(data: any[]): void {
    this.tableData = data;
  }
  
  onCellChange(event: CellChangeEvent): void {
    console.log('Cell changed:', event);
  }
  
  onActionClick(event: TableActionEvent): void {
    if (event.action === 'edit') {
      alert(`Editing row ${event.rowIndex + 1}: ${event.row.fullName}`);
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
  
  // Button Actions
  validateTable(): void {
    this.tableData = [...this.tableData];
    
    if (this.validationResult?.valid) {
      alert('✅ All validations passed!');
    } else {
      alert(`❌ Found ${this.validationResult?.errors.length || 0} validation error(s)`);
    }
  }
  
  resetData(): void {
    this.loadSampleData();
    this.validationResult = null;
  }
  
  saveData(): void {
    if (this.validationResult && !this.validationResult.valid) {
      alert('Please fix validation errors before saving.');
      return;
    }
    alert('Data saved successfully!');
  }
  
  // Utility functions
  private formatDate(date: Date): string {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  }
}
