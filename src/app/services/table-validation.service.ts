/**
 * TableValidationService
 * 
 * Provides config-driven validation for dynamic tables.
 * All validation rules come from column configuration, not component logic.
 */
import { Injectable } from '@angular/core';
import { 
  DynamicTableColumn, 
  TableFieldValidation,
  ValidationError,
  TableValidationResult 
} from '../models/dynamic-table.model';

@Injectable({
  providedIn: 'root'
})
export class TableValidationService {
  
  validateCell(
    value: any, 
    column: DynamicTableColumn, 
    row: any, 
    rowIndex: number,
    allRows: any[]
  ): string | null {
    if (column.type === 'readonly' || column.type === 'computed' || column.hidden) {
      return null;
    }
    
    const validation = column.validation || {};
    
    if (column.required || validation.required) {
      if (this.isEmpty(value)) {
        return validation.message || `${column.label} is required`;
      }
    }
    
    if (this.isEmpty(value)) {
      return null;
    }
    
    switch (column.type) {
      case 'number':
        return this.validateNumber(value, column, validation);
      case 'text':
      case 'textarea':
        return this.validateText(value, column, validation);
      case 'date':
        return this.validateDate(value, column, validation);
      case 'select':
        return this.validateSelect(value, column);
      default:
        break;
    }
    
    if (validation.pattern) {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(String(value))) {
        return validation.message || `${column.label} format is invalid`;
      }
    }
    
    if (validation.customValidator) {
      const customError = validation.customValidator(value, row, allRows);
      if (customError) {
        return customError;
      }
    }
    
    if (validation.crossFieldValidation) {
      const crossError = this.validateCrossField(value, row, validation.crossFieldValidation);
      if (crossError) {
        return crossError;
      }
    }
    
    if (validation.unique) {
      const uniqueError = this.validateUnique(value, column.key, rowIndex, allRows, validation);
      if (uniqueError) {
        return uniqueError;
      }
    }
    
    return null;
  }
  

  private validateNumber(
    value: any, 
    column: DynamicTableColumn, 
    validation: TableFieldValidation
  ): string | null {
    const num = Number(value);
    
    if (isNaN(num)) {
      return `${column.label} must be a valid number`;
    }
    
    const min = column.min ?? validation.min;
    const max = column.max ?? validation.max;
    
    if (min !== undefined && num < min) {
      return `${column.label} must be at least ${min}`;
    }
    
    if (max !== undefined && num > max) {
      return `${column.label} must be at most ${max}`;
    }
    
    return null;
  }
  

  private validateText(
    value: any, 
    column: DynamicTableColumn, 
    validation: TableFieldValidation
  ): string | null {
    const str = String(value);
    
    if (validation.min !== undefined && str.length < validation.min) {
      return `${column.label} must be at least ${validation.min} characters`;
    }
    
    if (validation.max !== undefined && str.length > validation.max) {
      return `${column.label} must be at most ${validation.max} characters`;
    }
    
    return null;
  }
  

  private validateDate(
    value: any, 
    column: DynamicTableColumn, 
    validation: TableFieldValidation
  ): string | null {
    if (!value) return null;
    
    const date = this.parseDate(value);
    if (!date) {
      return `${column.label} must be a valid date`;
    }
    
    if (column.minDate) {
      const minDate = this.parseDate(column.minDate);
      if (minDate && date < minDate) {
        return `${column.label} must be on or after ${this.formatDate(minDate)}`;
      }
    }
    
    if (column.maxDate) {
      const maxDate = this.parseDate(column.maxDate);
      if (maxDate && date > maxDate) {
        return `${column.label} must be on or before ${this.formatDate(maxDate)}`;
      }
    }
    
    return null;
  }
  

  private validateSelect(value: any, column: DynamicTableColumn): string | null {
    if (!column.options || column.options.length === 0) {
      return null;
    }
    
    const validValues = column.options.map(opt => opt.value);
    if (!validValues.includes(value)) {
      return `${column.label} must be a valid option`;
    }
    
    return null;
  }
  

  private validateCrossField(
    value: any, 
    row: any, 
    config: TableFieldValidation['crossFieldValidation']
  ): string | null {
    if (!config) return null;
    
    const relatedValue = row[config.relatedField];
    
    switch (config.operator) {
      case 'greaterThan':
        if (!(value > relatedValue)) {
          return config.message;
        }
        break;
      case 'lessThan':
        if (!(value < relatedValue)) {
          return config.message;
        }
        break;
      case 'greaterThanOrEquals':
        if (!(value >= relatedValue)) {
          return config.message;
        }
        break;
      case 'lessThanOrEquals':
        if (!(value <= relatedValue)) {
          return config.message;
        }
        break;
      case 'equals':
        if (value !== relatedValue) {
          return config.message;
        }
        break;
      case 'notEquals':
        if (value === relatedValue) {
          return config.message;
        }
        break;
    }
    
    return null;
  }
  

  private validateUnique(
    value: any, 
    key: string, 
    currentRowIndex: number, 
    allRows: any[],
    validation: TableFieldValidation
  ): string | null {
    const isDuplicate = allRows.some((row, index) => 
      index !== currentRowIndex && row[key] === value
    );
    
    if (isDuplicate) {
      return validation.uniqueMessage || 'This value must be unique';
    }
    
    return null;
  }
  

  validateRow(
    row: any, 
    rowIndex: number, 
    columns: DynamicTableColumn[], 
    allRows: any[]
  ): ValidationError[] {
    const errors: ValidationError[] = [];
    
    for (const column of columns) {
      const value = row[column.key];
      const error = this.validateCell(value, column, row, rowIndex, allRows);
      
      if (error) {
        errors.push({
          key: column.key,
          rowIndex,
          message: error,
          type: 'field'
        });
      }
    }
    
    return errors;
  }
  

  validateTable(
    data: any[], 
    columns: DynamicTableColumn[]
  ): TableValidationResult {
    const allErrors: ValidationError[] = [];
    
    data.forEach((row, rowIndex) => {
      const rowErrors = this.validateRow(row, rowIndex, columns, data);
      allErrors.push(...rowErrors);
    });
    
    return {
      valid: allErrors.length === 0,
      errors: allErrors
    };
  }
  

  getRowErrors(
    rowIndex: number, 
    errors: ValidationError[]
  ): ValidationError[] {
    return errors.filter(e => e.rowIndex === rowIndex);
  }
  

  getCellError(
    key: string, 
    rowIndex: number, 
    errors: ValidationError[]
  ): string | null {
    const error = errors.find(e => e.key === key && e.rowIndex === rowIndex);
    return error ? error.message : null;
  }
  

  private isEmpty(value: any): boolean {
    return value === undefined || 
           value === null || 
           value === '' ||
           (typeof value === 'string' && value.trim() === '');
  }
  

  private parseDate(dateStr: string | Date): Date | null {
    if (dateStr instanceof Date) {
      return dateStr;
    }
    
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
    
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }
  

  private formatDate(date: Date): string {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  }
}

