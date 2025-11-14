

// models/table.model.ts
export interface SimpleTableColumn {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
}

export interface SimpleTableConfig {
  title?: string;
  columns: SimpleTableColumn[];
}
