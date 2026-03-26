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
      <div class="date-input-wrapper">
        <input
          class="date-input"
          [placeholder]="placeholder"
          [value]="inputValue"
          (input)="onManualInput($event)"
          (blur)="onManualInputBlur($event)"
          (keydown.enter)="onManualInputBlur($event)"
        />
        <input
          matInput
          class="date-proxy-input"
          [matDatepicker]="picker"
          [value]="selectedDate"
          tabindex="-1"
          aria-hidden="true"
          (dateChange)="onDateChange($event)"
          (dateInput)="onDateInput($event)"
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
  inputValue: string = '';
  
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
  writeValue(value: any): void {
    if (value instanceof Date) {
      this.selectedDate = value;
      this.inputValue = this.formatDate(value);
    } else if (value) {
      const valueStr = String(value);
      this.selectedDate = this.parseDate(valueStr);
      this.inputValue = valueStr;
    } else {
      this.selectedDate = null;
      this.inputValue = '';
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
      this.applyDate(date);
    }
    this.onTouched();
  }

  onDateInput(event: any): void {
    const date = event.value as Date;
    if (date) {
      this.applyDate(date);
    }
  }

  onManualInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.inputValue = target.value;
    // Keep parent ngModel in sync during typing so input text is not reset.
    this.onChange(this.inputValue);
  }

  onManualInputBlur(event?: Event): void {
    const target = event?.target as HTMLInputElement | undefined;
    const rawValue = (target?.value || '').trim();

    if (!rawValue) {
      this.selectedDate = null;
      this.inputValue = '';
      this.onChange('');
      this.dateSelected.emit('');
      this.onTouched();
      return;
    }

    const parsed = this.parseDate(rawValue);
    if (parsed) {
      this.applyDate(parsed);
    } else if (this.selectedDate && target) {
      // Restore last valid value if typed text is invalid
      const restoredValue = this.formatDate(this.selectedDate);
      this.inputValue = restoredValue;
      target.value = restoredValue;
    }
    this.onTouched();
  }

  private applyDate(date: Date): void {
    this.selectedDate = date;
    const formattedDate = this.formatDate(date);
    this.inputValue = formattedDate;
    this.onChange(formattedDate);
    this.dateSelected.emit(formattedDate);
  }

  private formatDate(date: Date): string {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  }

  private parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;

    const normalized = dateStr.trim().replace(/\//g, '-');
    const parts = normalized.split('-');
    if (parts.length !== 3) return null;

    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      return null;
    }

    const candidate = new Date(year, month - 1, day);
    const isValidDate =
      candidate.getFullYear() === year &&
      candidate.getMonth() === month - 1 &&
      candidate.getDate() === day;

    if (isValidDate) {
      return candidate;
    }

    return null;
  }
}

