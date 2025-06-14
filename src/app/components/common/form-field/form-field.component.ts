// components/common/form-field/form-field.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormField } from '../../../models/form-model';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="custom-form-group">
      <label class="custom-form-label">
        {{ field.label }}:
        <ng-container [ngSwitch]="field.type">
          <!-- Text Input -->
          <input
            *ngSwitchCase="'text'"
            [type]="'text'"
            [class]="'custom-form-control'"
            [value]="value"
            [readonly]="field.readonly"
            (input)="onValueChange($event)"
          />

          <!-- Number Input -->
          <input
            *ngSwitchCase="'number'"
            type="number"
            class="custom-form-control"
            [value]="value"
            (input)="onValueChange($event)"
          />

          <!-- Select Input -->
          <select
            *ngSwitchCase="'select'"
            class="custom-form-select"
            [value]="value"
            (change)="onValueChange($event)"
          >
            <option *ngFor="let opt of field.options" [value]="opt.value">
              {{ opt.label }}
            </option>
          </select>

          <!-- Modal Select Input -->
          <div *ngSwitchCase="'modal-select'" class="modal-select-container">
            <input
              type="text"
              class="tier-profile-input"
              [value]="value"
              readonly
              (click)="openModal.emit(field)"
            />
          </div>
        </ng-container>
      </label>
    </div>
  `,
  styles: [`
    .modal-select-container {
      position: relative;
    }

    .modal-select-icon {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
    }
  `]
})
export class FormFieldComponent {
  @Input() field!: FormField;
  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();
  @Output() openModal = new EventEmitter<FormField>();

  onValueChange(event: Event) {
    const value = (event.target as HTMLInputElement | HTMLSelectElement).value;
    this.valueChange.emit(
      this.field.type === 'number' ? +value : value
    );
  }
}