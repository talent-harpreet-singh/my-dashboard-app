import { Component, Input } from '@angular/core';
import { Program } from '../../models/rule.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from '../common/date-picker/date-picker.component';
import { exportTableToExcel } from '../../utils/excel-export.util';

@Component({
  selector: 'app-programs-table',
  templateUrl: './programs-table.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePickerComponent]
})
export class ProgramsTableComponent {
  @Input() programs: Program[] = [];
  exportFileName = 'Programs.xlsx';
  
  sortColumn: keyof Program | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  sortBy(column: keyof Program): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.programs.sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];

      // Handle boolean
      if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
        return this.sortDirection === 'asc' 
          ? (aVal === bVal ? 0 : aVal ? 1 : -1)
          : (aVal === bVal ? 0 : aVal ? -1 : 1);
      }

      // Handle string comparison
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (aStr < bStr) return this.sortDirection === 'asc' ? -1 : 1;
      if (aStr > bStr) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getSortIcon(column: keyof Program): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? '▲' : '▼';
    }
    return '';
  }

  addProgram() {
    const newProgram: Program = {
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
    this.programs.push(newProgram);
  }

  updatePrograms() {
    alert('Programs updated (locally).');
  }

  rejectChanges() {
    alert('Rejected changes (reset not implemented).');
  }

  confirmPrograms() {
    alert('Programs confirmed!');
  }

  cancelEdit() {
    alert('Canceled edits (UI only).');
  }

  exportToExcel(): void {
    exportTableToExcel('programsTable', this.exportFileName, 'Programs');
  }
}