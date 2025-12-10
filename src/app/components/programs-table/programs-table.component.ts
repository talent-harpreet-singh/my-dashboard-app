import { Component, Input } from '@angular/core';
import { Program } from '../../models/rule.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { exportTableToExcel } from '../../utils/excel-export.util';

@Component({
  selector: 'app-programs-table',
  templateUrl: './programs-table.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class ProgramsTableComponent {
  @Input() programs: Program[] = [];
  exportFileName = 'Programs.xlsx';

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