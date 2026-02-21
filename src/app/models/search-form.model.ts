// models/search-form.model.ts
export interface SearchField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'range';
  placeholder?: string;
  options?: SelectOption[];
  defaultValue?: string | number;
  rangeFields?: {
    from?: string;
    to?: string;
  };
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SearchFormConfig {
  title: string;
  subtitle?: string;
  fields: SearchField[];
  buttonLabels?: {
    find?: string;
    reset?: string;
  };
}
