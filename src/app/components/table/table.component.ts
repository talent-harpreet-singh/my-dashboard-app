import { Component, ElementRef, Input, ViewChild, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleTableConfig } from '../../models/table.model';

@Component({
  selector: 'app-simple-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container" #tableContainer>
      <div class="table-header" *ngIf="config.title">
        <h3 class="table-title">{{ config.title }}</h3>
        <div class="table-subtitle">
          Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ data.length }} records
        </div>
      </div>

      <div class="table-wrapper" #tableWrapper>
        <div class="table-scroll-container" #scrollContainer>
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
      min-height: 400px;
      max-height: calc(100vh - 150px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      width: calc(100% - 3rem);
      max-width: 100%;
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
      border-radius:0.4rem;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      flex-shrink: 0;
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
      flex: 1;
      overflow: hidden;
      min-height: 0;
      position: relative;
    }

    .table-scroll-container {
      width: 100%;
      height: 100%;
      overflow: auto;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE and Edge */
      cursor: default;
      position: relative;
    }

    .table-scroll-container::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }

    .table-scroll-container:hover {
      cursor: auto;
    }

    .simple-table {
      width: 100%;
      min-width: 800px; /* Ensure minimum table width */
      border-collapse: separate;
      border-spacing: 0;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      font-size: 0.875rem;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      table-layout: fixed; /* Fixed table layout for consistent column widths */
    }

    .table-header-cell {
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      color: #1e293b;
      font-weight: 600;
      padding: 1rem 1.5rem;
      text-align: left;
      border-bottom: 2px solid #e2e8f0;
      position: sticky;
      top: 0;
      z-index: 10;
      font-size: 0.75rem;
      letter-spacing: 0.025em;
      text-transform: uppercase;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 120px;
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
      flex-shrink: 0;
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
      flex-shrink: 0;
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
        min-height: 350px;
        max-height: calc(100vh - 100px);
        width: calc(100% - 2rem);
      }

      .table-header {
        padding: 1rem 1.5rem;
      }

      .table-title {
        font-size: 1.25rem;
      }

      .simple-table {
        min-width: 600px; /* Smaller minimum width for mobile */
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

    /* Zoom level responsive adjustments */
    @media screen and (max-height: 600px) {
      .table-container {
        min-height: 300px;
        max-height: calc(100vh - 80px);
      }
    }

    @media screen and (min-height: 800px) {
      .table-container {
        min-height: 500px;
        max-height: calc(100vh - 200px);
      }
    }

    /* Prevent sidebar collision */
    @media screen and (max-width: 1200px) {
      .table-container {
        width: calc(100% - 2rem);
        margin: 1rem;
      }
    }

    @media screen and (min-width: 1201px) {
      .table-container {
        width: calc(100% - 3rem);
        margin: 1.5rem;
      }
    }
  `]
})
export class SimpleTableComponent implements OnInit, OnDestroy {
  @Input() config!: SimpleTableConfig;
  @Input() data: any[] = [];
  @Input() itemsPerPage: number = 10; // Number of items per page

  @ViewChild('tableContainer') tableContainer!: ElementRef;
  @ViewChild('tableWrapper') tableWrapper!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  currentPage: number = 1;

  ngOnInit() {
    this.adjustTableHeight();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  @HostListener('window:resize')
  @HostListener('window:orientationchange')
  onResize() {
    // Debounce the resize event
    setTimeout(() => {
      this.adjustTableHeight();
    }, 100);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.scrollContainer) {
      const scrollContainer = this.scrollContainer.nativeElement;
      const scrollAmount = 50; // Adjust scroll amount as needed

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          scrollContainer.scrollTop -= scrollAmount;
          break;
        case 'ArrowDown':
          event.preventDefault();
          scrollContainer.scrollTop += scrollAmount;
          break;
        case 'ArrowLeft':
          event.preventDefault();
          scrollContainer.scrollLeft -= scrollAmount;
          break;
        case 'ArrowRight':
          event.preventDefault();
          scrollContainer.scrollLeft += scrollAmount;
          break;
        case 'PageUp':
          event.preventDefault();
          scrollContainer.scrollTop -= scrollContainer.clientHeight;
          break;
        case 'PageDown':
          event.preventDefault();
          scrollContainer.scrollTop += scrollContainer.clientHeight;
          break;
        case 'Home':
          event.preventDefault();
          scrollContainer.scrollTop = 0;
          scrollContainer.scrollLeft = 0;
          break;
        case 'End':
          event.preventDefault();
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
          scrollContainer.scrollLeft = scrollContainer.scrollWidth;
          break;
      }
    }
  }

  private adjustTableHeight() {
    const container = this.tableContainer?.nativeElement as HTMLElement;
    if (container) {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Calculate available space
      let availableHeight: number;

      if (viewportWidth <= 768) {
        availableHeight = viewportHeight - 100;
      } else if (viewportWidth <= 1200) {
        availableHeight = viewportHeight - 150;
      } else {
        availableHeight = viewportHeight - 150;
      }

      // Calculate content height (header + table content + pagination)
      const headerElement = container.querySelector('.table-header') as HTMLElement;
      const paginationElement = container.querySelector('.pagination-container') as HTMLElement;
      const headerHeight = headerElement?.offsetHeight || 0;
      const paginationHeight = paginationElement?.offsetHeight || 0;
      const tableContentHeight = this.calculateTableContentHeight();

      const totalContentHeight = headerHeight + tableContentHeight + paginationHeight;

      // Set container height based on content vs available space
      if (totalContentHeight <= availableHeight) {
        // Content fits, use content height (no scroll needed)
        container.style.height = `${totalContentHeight}px`;
        container.style.maxHeight = `${totalContentHeight}px`;
      } else {
        // Content exceeds available space, use available height (scroll needed)
        container.style.height = `${availableHeight}px`;
        container.style.maxHeight = `${availableHeight}px`;
      }
    }
  }

  private calculateTableContentHeight(): number {
    // Estimate table content height based on number of rows
    const rowHeight = 60; // Approximate height per row
    const headerHeight = 50; // Approximate header height
    const visibleRows = Math.min(this.paginatedData.length, this.itemsPerPage);
    return headerHeight + (visibleRows * rowHeight);
  }

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
      setTimeout(() => this.adjustTableHeight(), 50);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      setTimeout(() => this.adjustTableHeight(), 50);
    }
  }

  ngAfterViewInit() {
    this.adjustTableHeight();

    // Add scroll shadow effect and ensure mouse scrolling works
    if (this.scrollContainer) {
      const scrollContainer = this.scrollContainer.nativeElement;

      // Add scroll event listener
      scrollContainer.addEventListener('scroll', () => {
        scrollContainer.classList.toggle('is-scrolling', scrollContainer.scrollTop > 0 || scrollContainer.scrollLeft > 0);
      });

      // Ensure the scroll container can receive mouse events
      scrollContainer.style.pointerEvents = 'auto';
      scrollContainer.style.userSelect = 'none';

      // Force the scroll container to be focusable for better event handling
      scrollContainer.tabIndex = 0;
      scrollContainer.style.outline = 'none';
    }
  }
}
