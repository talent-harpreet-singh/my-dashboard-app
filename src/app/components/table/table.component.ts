import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleTableConfig } from '../../models/table.model';

@Component({
  selector: 'app-simple-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <div class="table-header" *ngIf="config.title">
        <h3 class="table-title">{{ config.title }}</h3>
        <div class="table-subtitle">
          Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ data.length }} records
        </div>
      </div>

      <div class="table-wrapper">
        <table class="simple-table">
          <thead>
            <tr>
              <th *ngFor="let column of config.columns; let i = index"
                  [style.width]="column.width"
                  class="table-header-cell"
                  [style.animation-delay]="(i * 100) + 'ms'">
                {{ column.header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of paginatedData; let rowIndex = index"
                class="table-row"
                [style.animation-delay]="(rowIndex * 50) + 'ms'">
              <td *ngFor="let column of config.columns"
                  class="table-cell"
                  [class.status-cell]="column.key === 'status'">
                <span *ngIf="column.key === 'status'"
                      class="status-badge"
                      [class.status-live]="row[column.key] === 'Live'"
                      [class.status-pending]="row[column.key] === 'P'">
                  {{ row[column.key] }}
                </span>
                <span *ngIf="column.key !== 'status'">
                  {{ row[column.key] }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination-container" *ngIf="data.length > itemsPerPage">
        <button
          class="pagination-btn prev-btn"
          [disabled]="currentPage === 1"
          (click)="previousPage()"
          [class.disabled]="currentPage === 1">
          ← Previous
        </button>

        <button
          class="pagination-btn next-btn"
          [disabled]="currentPage >= totalPages"
          (click)="nextPage()"
          [class.disabled]="currentPage >= totalPages">
          Next →
        </button>
      </div>

      <div class="table-footer" *ngIf="data.length === 0">
        <div class="empty-state">
          <div class="empty-icon">📊</div>
          <p>No data available</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border-radius: 16px;
      box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06),
        0 0 0 1px rgba(255, 255, 255, 0.05);
      margin: 1.5rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(226, 232, 240, 0.8);
      animation: fadeIn 0.6s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .table-container:hover {
      transform: translateY(-2px);
      box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05),
        0 0 0 1px rgba(255, 255, 255, 0.1);
    }

    .table-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1.5rem 2rem;
      color: white;
      position: relative;
      overflow: hidden;
    }

    .table-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
    }

    .table-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.025em;
      position: relative;
      z-index: 1;
    }

    .table-subtitle {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      opacity: 0.9;
      position: relative;
      z-index: 1;
    }

    .table-wrapper {
      background: white;
      max-height: 40rem;
      overflow: hidden;
    }

    @media (min-width: 1600px) {
      .table-wrapper {
        max-height: 50rem;
      }
    }

    @media (min-width: 1700px) {
      .table-wrapper {
        max-height: 60rem;
      }
    }

    .simple-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 0.875rem;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .table-header-cell {
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      color: #1e293b;
      font-weight: 600;
      padding: 1rem 1.5rem;
      text-align: left;
      border-bottom: 2px solid #e2e8f0;
      position: relative;
      font-size: 0.75rem;
      letter-spacing: 0.025em;
      text-transform: uppercase;
    }

    .table-header-cell::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    .table-header-cell:hover::after {
      transform: scaleX(1);
    }

    .table-row {
      transition: all 0.2s ease;
      position: relative;
    }

    .table-row:hover {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      transform: scale(1.01);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .table-cell {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .table-cell:hover {
      background: rgba(102, 126, 234, 0.05);
    }

    .status-cell {
      text-align: center;
    }

    .status-badge {
      display: inline-block;
      padding: 0.375rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      transition: all 0.2s ease;
      position: relative;
      overflow: auto;
    }

    .status-badge::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
    }

    .status-badge:hover::before {
      left: 100%;
    }

    .status-live {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
    }

    .status-pending {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
    }

    /* Pagination Styles */
    .pagination-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem 2rem;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }

    .pagination-btn {
      padding: 0.75rem 1.5rem;
      border: 1px solid #cbd5e1;
      background: white;
      color: #475569;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
    }

    .pagination-btn:hover:not(.disabled) {
      background: #f1f5f9;
      border-color: #94a3b8;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .pagination-btn.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: #f1f5f9;
      color: #94a3b8;
    }

    .pagination-btn.disabled:hover {
      transform: none;
      box-shadow: none;
    }

    .table-footer {
      padding: 2rem;
      text-align: center;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      color: #64748b;
    }

    .empty-icon {
      font-size: 3rem;
      opacity: 0.5;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .table-container {
        margin: 1rem;
        border-radius: 12px;
      }

      .table-header {
        padding: 1rem 1.5rem;
      }

      .table-title {
        font-size: 1.25rem;
      }

      .table-cell,
      .table-header-cell {
        padding: 0.75rem 1rem;
        font-size: 0.8rem;
      }

      .status-badge {
        padding: 0.25rem 0.5rem;
        font-size: 0.7rem;
      }

      .pagination-container {
        padding: 1rem;
        gap: 0.5rem;
      }

      .pagination-btn {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
      }
    }
  `]
})
export class SimpleTableComponent {
  @Input() config!: SimpleTableConfig;
  @Input() data: any[] = [];
  @Input() itemsPerPage: number = 10; // Number of items per page

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  currentPage: number = 1;

  get totalPages(): number {
    return Math.ceil(this.data.length / this.itemsPerPage);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage, this.data.length);
  }

  get paginatedData(): any[] {
    return this.data.slice(this.startIndex, this.endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  ngAfterViewInit() {
    // Optional: Add scroll shadow effect
    if (this.scrollContainer) {
      const container = this.scrollContainer.nativeElement;
      container.addEventListener('scroll', () => {
        container.classList.toggle('is-scrolling', container.scrollTop > 0);
      });
    }
  }
}
