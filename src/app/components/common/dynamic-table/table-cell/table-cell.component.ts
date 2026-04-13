
import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  OnInit, 
  OnChanges, 
  SimpleChanges,
  forwardRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DynamicTableColumn } from '../../../../models/dynamic-table.model';
import { DatePickerComponent } from '../../date-picker/date-picker.component';

@Component({
  selector: 'app-table-cell',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatIconModule,
    DatePickerComponent
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TableCellComponent),
      multi: true
    }
  ],
  template: `
    <!-- Container with dynamic classes -->
    <div 
      [class]="getCellContainerClass()"
      [class.dt-cell-error-highlight]="hasError">
      
      <!-- TEXT INPUT -->
      <ng-container *ngIf="column.type === 'text'">
        <input
          type="text"
          class="dt-cell-input"
          [class.invalid]="hasError"
          [value]="displayValue"
          [placeholder]="column.placeholder || ''"
          [readonly]="column.readonly"
          [disabled]="column.disabled"
          [title]="column.tooltip || ''"
          (input)="onInputChange($event)"
          (focus)="onFocus()"
          (blur)="onBlur($event)"
        />
      </ng-container>
      
      <!-- NUMBER INPUT -->
      <ng-container *ngIf="column.type === 'number'">
        <input
          type="number"
          class="dt-cell-input"
          [class.invalid]="hasError"
          [value]="value"
          [placeholder]="column.placeholder || ''"
          [readonly]="column.readonly"
          [disabled]="column.disabled"
          [min]="column.min"
          [max]="column.max"
          [step]="column.step || 1"
          [title]="column.tooltip || ''"
          (input)="onNumberChange($event)"
          (focus)="onFocus()"
          (blur)="onBlur($event)"
        />
      </ng-container>
      
      <!-- DATE PICKER -->
      <ng-container *ngIf="column.type === 'date'">
        <div class="dt-date-picker-cell">
          <app-date-picker
            [ngModel]="value"
            [placeholder]="column.placeholder || 'MM-DD-YYYY'"
            [compact]="true"
            [hasError]="hasError"
            (ngModelChange)="onDateChange($event)"
          ></app-date-picker>
        </div>
      </ng-container>
      
      <!-- SELECT/DROPDOWN -->
      <ng-container *ngIf="column.type === 'select'">
        <select
          class="dt-cell-select"
          [class.invalid]="hasError"
          [value]="value"
          [disabled]="column.disabled || column.readonly"
          [title]="column.tooltip || ''"
          (change)="onSelectChange($event)">
          <option value="" *ngIf="column.placeholder">{{ column.placeholder }}</option>
          <option 
            *ngFor="let opt of column.options" 
            [value]="opt.value"
            [selected]="opt.value === value">
            {{ opt.label }}
          </option>
        </select>
      </ng-container>
      
      <!-- RADIO BUTTONS -->
      <ng-container *ngIf="column.type === 'radio'">
        <div class="dt-radio-group">
          <label 
            *ngFor="let opt of column.radioOptions"
            class="dt-radio-label">
            <input
              type="radio"
              [name]="getRadioName()"
              [value]="opt.value"
              [checked]="opt.value === value"
              [disabled]="opt.disabled || column.disabled || column.readonly"
              (change)="onRadioChange(opt.value)"
            />
            {{ opt.label }}
          </label>
        </div>
      </ng-container>
      
      <!-- CHECKBOX -->
      <ng-container *ngIf="column.type === 'checkbox'">
        <div class="dt-cell-checkbox">
          <input
            type="checkbox"
            [checked]="value"
            [disabled]="column.disabled || column.readonly"
            [title]="column.tooltip || ''"
            (change)="onCheckboxChange($event)"
          />
        </div>
      </ng-container>
      
      <!-- TEXTAREA -->
      <ng-container *ngIf="column.type === 'textarea'">
        <textarea
          class="dt-cell-textarea"
          [class.invalid]="hasError"
          [value]="displayValue"
          [placeholder]="column.placeholder || ''"
          [readonly]="column.readonly"
          [disabled]="column.disabled"
          [title]="column.tooltip || ''"
          (input)="onInputChange($event)"
          (focus)="onFocus()"
          (blur)="onBlur($event)"
        ></textarea>
      </ng-container>
      
      <!-- READONLY -->
      <ng-container *ngIf="column.type === 'readonly'">
        <span class="dt-cell-readonly" [title]="column.tooltip || ''">
          {{ displayValue }}
        </span>
      </ng-container>
      
      <!-- COMPUTED -->
      <ng-container *ngIf="column.type === 'computed'">
        <span class="dt-cell-computed" [title]="column.tooltip || ''">
          {{ computedValue }}
        </span>
      </ng-container>
      
      <!-- Validation Error Message -->
      <div *ngIf="hasError && showError" class="dt-validation-error">
        <mat-icon>error_outline</mat-icon>
        {{ errorMessage }}
      </div>
    </div>
  `
})
export class TableCellComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() column!: DynamicTableColumn;
  @Input() value: any;
  @Input() row: any;
  @Input() rowIndex: number = 0;
  @Input() hasError: boolean = false;
  @Input() errorMessage: string = '';
  @Input() showError: boolean = true;
  
  @Output() valueChange = new EventEmitter<any>();
  @Output() cellFocus = new EventEmitter<void>();
  @Output() cellBlur = new EventEmitter<any>();
  
  displayValue: string = '';
  computedValue: any = '';
  
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  
  ngOnInit(): void {
    this.updateDisplayValue();
    this.updateComputedValue();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] || changes['row']) {
      this.updateDisplayValue();
      this.updateComputedValue();
    }
  }
  
  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value = value;
    this.updateDisplayValue();
  }
  
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  // Get cell container class based on config
  getCellContainerClass(): string {
    const classes: string[] = [];
    
    if (this.column.className) {
      classes.push(this.column.className);
    }
    
    if (this.column.align) {
      classes.push(`dt-cell-${this.column.align}`);
    }
    
    // Add conditional class if defined
    if (this.column.cellStyle?.conditionalClass) {
      const condition = this.column.cellStyle.conditionalClass.condition;
      if (condition(this.value, this.row)) {
        classes.push(this.column.cellStyle.conditionalClass.trueClass);
      } else if (this.column.cellStyle.conditionalClass.falseClass) {
        classes.push(this.column.cellStyle.conditionalClass.falseClass);
      }
    }
    
    return classes.join(' ');
  }
  
  // Get unique radio button name
  getRadioName(): string {
    return `${this.column.key}_${this.rowIndex}`;
  }
  
  // Update display value using formatter if available
  private updateDisplayValue(): void {
    if (this.column.formatter && this.value !== undefined && this.value !== null) {
      this.displayValue = this.column.formatter(this.value, this.row);
    } else {
      this.displayValue = this.value ?? '';
    }
  }
  
  // Update computed value
  private updateComputedValue(): void {
    if (this.column.type === 'computed' && this.column.computedConfig?.compute) {
      this.computedValue = this.column.computedConfig.compute(this.row);
    }
  }
  
  // Parse value using parser if available
  private parseValue(displayValue: any): any {
    if (this.column.parser) {
      return this.column.parser(displayValue);
    }
    return displayValue;
  }
  
  // Emit value change
  private emitChange(value: any): void {
    const parsedValue = this.parseValue(value);
    this.value = parsedValue;
    this.valueChange.emit(parsedValue);
    this.onChange(parsedValue);
    
    // Call column-specific onChange callback if defined
    if (this.column.onChange) {
      this.column.onChange(parsedValue, this.row, this.rowIndex);
    }
  }
  
  // Event handlers
  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.displayValue = target.value;
    this.emitChange(target.value);
  }
  
  onNumberChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value === '' ? null : +target.value;
    this.emitChange(value);
  }
  
  onDateChange(value: string): void {
    this.emitChange(value);
  }
  
  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.emitChange(target.value);
  }
  
  onRadioChange(value: any): void {
    this.emitChange(value);
  }
  
  onCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.emitChange(target.checked);
  }
  
  onFocus(): void {
    this.cellFocus.emit();
    if (this.column.onFocus) {
      this.column.onFocus(this.row, this.rowIndex);
    }
  }
  
  onBlur(event: Event): void {
    this.onTouched();
    const target = event.target as HTMLInputElement;
    this.cellBlur.emit(target.value);
    
    if (this.column.onBlur) {
      this.column.onBlur(this.value, this.row, this.rowIndex);
    }
  }
}

