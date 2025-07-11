// components/common/dynamic-form/dynamic-form.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../form-field/form-field.component';
import { FormField } from '../../../models/form-model';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, FormFieldComponent],
  template: `
    <div class="form-card">
      <div class="form-header" *ngIf="showHeader">
        <div class="form-title">{{ title }}</div>
        <div class="form-meta" *ngIf="metadata">
        </div>
      </div>

      <div class="form-section">
        <app-form-field
          *ngFor="let field of fields"
          [field]="field"
          [value]="formData[field.key]"
          (valueChange)="onFieldChange(field.key, $event)"
          (openModal)="onOpenModal($event)"
        ></app-form-field>
      </div>
    </div>
  `
})
export class DynamicFormComponent {
  @Input() title: string = '';
  @Input() showHeader: boolean = true;
  @Input() metadata: { label: string; value: any }[] = [];
  @Input() fields: FormField[] = [];
  @Input() formData: any = {};

  @Output() fieldChange = new EventEmitter<{key: string; value: any}>();
  @Output() modalOpen = new EventEmitter<FormField>();

  onFieldChange(key: string, value: any) {
    this.fieldChange.emit({ key, value });
  }

  onOpenModal(field: FormField) {
    this.modalOpen.emit(field);
  }
}
