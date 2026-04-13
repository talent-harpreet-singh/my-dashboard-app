import { Component, Input, Output, EventEmitter, forwardRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { formatMmDdYyyy, parseFlexibleToDate } from '../../../utils/mm-dd-yyyy-date.util';

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
          [class.invalid]="manualInputInvalid || hasError"
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
  @Input() hasError: boolean = false;
  @Input() startView: 'month' | 'year' | 'multi-year' = 'month';
  @Output() dateSelected = new EventEmitter<string>();

  @ViewChild('picker') picker!: MatDatepicker<Date>;

  selectedDate: Date | null = null;
  inputValue: string = '';
  /** True after blur when the visible text is not a valid calendar date (manual entry). */
  manualInputInvalid: boolean = false;
  
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
    this.manualInputInvalid = false;
    if (value instanceof Date) {
      if (isNaN(value.getTime())) {
        this.selectedDate = null;
        this.inputValue = '';
        return;
      }
      this.selectedDate = value;
      this.inputValue = formatMmDdYyyy(value);
      return;
    }
    if (value == null || value === '') {
      this.selectedDate = null;
      this.inputValue = '';
      return;
    }

    const valueStr = String(value).trim();
    const parsed = parseFlexibleToDate(valueStr);
    if (parsed) {
      const formatted = formatMmDdYyyy(parsed);
      this.selectedDate = parsed;
      this.inputValue = formatted;
      if (formatted !== valueStr) {
        Promise.resolve().then(() => this.onChange(formatted));
      }
    } else {
      this.selectedDate = null;
      this.inputValue = valueStr;
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
    this.manualInputInvalid = false;
    this.onTouched();
  }

  onDateInput(event: any): void {
    const date = event.value as Date;
    if (date) {
      this.applyDate(date);
    }
    this.manualInputInvalid = false;
  }

  onManualInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.inputValue = target.value;
    this.manualInputInvalid = false;
    // Keep parent ngModel in sync during typing so input text is not reset.
    this.onChange(this.inputValue);
  }

  onManualInputBlur(event?: Event): void {
    const target = event?.target as HTMLInputElement | undefined;
    const rawValue = (target?.value || this.inputValue || '').trim();

    if (!rawValue) {
      this.selectedDate = null;
      this.inputValue = '';
      this.manualInputInvalid = false;
      this.onChange('');
      this.dateSelected.emit('');
      this.onTouched();
      return;
    }

    const parsed = parseFlexibleToDate(rawValue);
    if (parsed) {
      this.manualInputInvalid = false;
      this.applyDate(parsed);
    } else if (this.selectedDate && target) {
      // Restore last valid value if typed text is invalid
      const restoredValue = formatMmDdYyyy(this.selectedDate);
      this.inputValue = restoredValue;
      target.value = restoredValue;
      this.manualInputInvalid = false;
      this.onChange(restoredValue);
      this.dateSelected.emit(restoredValue);
    } else {
      this.manualInputInvalid = true;
      this.inputValue = rawValue;
      if (target) {
        target.value = rawValue;
      }
    }
    this.onTouched();
  }

  private applyDate(date: Date): void {
    this.manualInputInvalid = false;
    this.selectedDate = date;
    const formattedDate = formatMmDdYyyy(date);
    this.inputValue = formattedDate;
    this.onChange(formattedDate);
    this.dateSelected.emit(formattedDate);
  }
}

