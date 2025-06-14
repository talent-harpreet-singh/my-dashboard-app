// models/form.model.ts
export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'modal-select';
  options?: SelectOption[];
  modalConfig?: ModalConfig;
  validation?: FieldValidation;
  readonly?: boolean;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface ModalConfig {
  title: string;
  columns: string[];
  displayKeys: string[];
  data: any[];
}

export interface FieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}