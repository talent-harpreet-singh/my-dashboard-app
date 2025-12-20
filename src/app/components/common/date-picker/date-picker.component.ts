import { Component, Input, Output, EventEmitter, forwardRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatIconModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ],
  template: `
    <div class="app-date-picker" [class.compact]="compact">
      <div class="date-input-wrapper" (click)="picker.open()">
        <input
          class="date-input"
          [matDatepicker]="picker"
          [placeholder]="placeholder"
          [value]="selectedDate"
          (dateChange)="onDateChange($event)"
          readonly
        />
        <mat-datepicker-toggle [for]="picker" class="date-toggle">
          <mat-icon matDatepickerToggleIcon>calendar_today</mat-icon>
        </mat-datepicker-toggle>
        <mat-datepicker
          #picker
          [startView]="startView"
          [startAt]="calendarStartDate"
        ></mat-datepicker>
      </div>
    </div>
  `
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() placeholder: string = 'MM-DD-YYYY';
  @Input() compact: boolean = false;
  @Input() startView: 'month' | 'year' | 'multi-year' = 'month';
  @Output() dateSelected = new EventEmitter<string>();

  @ViewChild('picker') picker!: MatDatepicker<Date>;

  selectedDate: Date | null = null;
  
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  // Returns a sensible start date for the calendar (current date if selected date is too far)
  get calendarStartDate(): Date {
    if (this.selectedDate) {
      const year = this.selectedDate.getFullYear();
      const currentYear = new Date().getFullYear();
      // If year is within reasonable range (current year ± 50 years), use selected date
      if (year >= currentYear - 50 && year <= currentYear + 50) {
        return this.selectedDate;
      }
    }
    // Default to current date
    return new Date();
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    if (value) {
      this.selectedDate = this.parseDate(value);
    } else {
      this.selectedDate = null;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onDateChange(event: any): void {
    const date = event.value as Date;
    if (date) {
      const formattedDate = this.formatDate(date);
      this.onChange(formattedDate);
      this.dateSelected.emit(formattedDate);
    }
    this.onTouched();
  }

  private formatDate(date: Date): string {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  }

  private parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10) - 1;
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    return null;
  }
}

