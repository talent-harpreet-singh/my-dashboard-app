// components/common/search-form/search-form.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchFormConfig, SearchField } from '../../../models/search-form.model';
import { NotesSectionComponent } from '../../notes-section/notes-section.component';
import { Note } from '../../../models/rule.model';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NotesSectionComponent],
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {
  @Input() config!: SearchFormConfig;
  @Output() search = new EventEmitter<any>();
  @Output() reset = new EventEmitter<void>();

  formData: { [key: string]: any } = {};
  columns: SearchField[][] = [];
  fullWidthFields: SearchField[] = [];
  showNotes: boolean = false;
  notes: (Note & { isNew?: boolean })[] = [];

  ngOnInit(): void {
    this.initializeFormData();
    this.organizeFieldsIntoColumns();
  }

  private initializeFormData(): void {
    this.config.fields.forEach(field => {
      if (field.type === 'range') {
        // Prefix selector (dropdown)
        if (field.options && field.options.length > 0) {
          this.formData[`${field.key}Prefix`] = field.options[0]?.value || '';
        }
        // From and To fields
        this.formData[field.rangeFields?.from || `${field.key}From`] = field.defaultValue || '';
        this.formData[field.rangeFields?.to || `${field.key}To`] = field.defaultValue || '';
      } else {
        this.formData[field.key] = field.defaultValue || '';
      }
    });
  }

  private organizeFieldsIntoColumns(): void {
    // Separate full-width fields (range fields) from regular fields
    this.fullWidthFields = this.config.fields.filter(field => field.type === 'range');
    const regularFields = this.config.fields.filter(field => field.type !== 'range');
    
    const totalFields = regularFields.length;
    let columnsCount = 3; // Default to 3 columns

    // Responsive column calculation based on number of fields
    if (totalFields <= 3) {
      columnsCount = totalFields;
    } else if (totalFields <= 6) {
      columnsCount = 3;
    } else if (totalFields <= 9) {
      columnsCount = 3;
    } else {
      columnsCount = 4; // For more than 9 fields, use 4 columns
    }

    // Distribute regular fields across columns
    this.columns = [];
    for (let i = 0; i < columnsCount; i++) {
      this.columns.push([]);
    }

    regularFields.forEach((field, index) => {
      const columnIndex = index % columnsCount;
      this.columns[columnIndex].push(field);
    });
  }

  onSearch(): void {
    this.search.emit(this.formData);
    this.showNotes = true;
    // Initialize notes if empty
    if (this.notes.length === 0) {
      this.notes = [];
    }
  }

  onReset(): void {
    this.initializeFormData();
    this.showNotes = false;
    this.notes = [];
    this.reset.emit();
  }

  onNoteAdded(): void {
    // Handle note added event if needed
  }

  getFieldValue(field: SearchField, suffix?: string): any {
    if (field.type === 'range') {
      if (suffix === 'prefix') {
        return this.formData[`${field.key}Prefix`] || '';
      }
      const key = suffix === 'from' 
        ? (field.rangeFields?.from || `${field.key}From`)
        : (field.rangeFields?.to || `${field.key}To`);
      return this.formData[key] || '';
    }
    return this.formData[field.key] || '';
  }

  setFieldValue(field: SearchField, value: any, suffix?: string): void {
    if (field.type === 'range') {
      if (suffix === 'prefix') {
        this.formData[`${field.key}Prefix`] = value;
      } else {
        const key = suffix === 'from' 
          ? (field.rangeFields?.from || `${field.key}From`)
          : (field.rangeFields?.to || `${field.key}To`);
        this.formData[key] = value;
      }
    } else {
      this.formData[field.key] = value;
    }
  }

  getRangeFromKey(field: SearchField): string {
    return field.rangeFields?.from || `${field.key}From`;
  }

  getRangeToKey(field: SearchField): string {
    return field.rangeFields?.to || `${field.key}To`;
  }
}
