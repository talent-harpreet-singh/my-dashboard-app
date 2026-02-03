

// models/table.model.ts
export interface SimpleTableColumn {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  clickable?: boolean; // New property to make column clickable
  clickHandler?: (row: any) => void; // Optional custom click handler
}

export interface SimpleTableConfig {
  title?: string;
  columns: SimpleTableColumn[];
}
