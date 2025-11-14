import { Component, ElementRef, Input, ViewChild, OnInit, OnChanges, OnDestroy, HostListener, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SimpleTableConfig } from '../../models/table.model';

@Component({
  selector: 'app-simple-table',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="table-container" #tableContainer>
      <div class="table-header" *ngIf="config.title">
        <h3 class="table-title">{{ config.title }}</h3>
        <div class="table-subtitle">
          Showing {{ displayedData.length }} of {{ totalRecords }} records
        </div>
      </div>

      <div class="table-wrapper" #tableWrapper>
        <div class="table-scroll-container" #scrollContainer
             (scroll)="onScroll()">
          <table class="simple-table">
            <thead>
              <tr>
                <th *ngFor="let column of config.columns; let i = index"
                    [style.width]="column.width"
                    class="table-header-cell"
                    [class.sortable]="column.sortable"
                    [class.sorted-asc]="column.sortable && sortColumn === column.key && sortDirection === 'asc'"
                    [class.sorted-desc]="column.sortable && sortColumn === column.key && sortDirection === 'desc'"
                    [style.animation-delay]="(i * 100) + 'ms'"
                    (mouseenter)="onHeaderHover(column.key)"
                    (mouseleave)="onHeaderLeave(column.key)"
                    (click)="column.sortable && sortBy(column.key)">
                  <div class="header-content">
                    <span>{{ column.header }}</span>
                    <span
                      *ngIf="column.sortable"
                      class="sort-indicator"
                      [class.visible]="hoveredColumn === column.key || (sortColumn === column.key && sortedIconVisible)">
                      <mat-icon
                        class="sort-icon"
                        [class.active]="sortColumn === column.key">
                        {{ getSortIcon(column.key) }}
                      </mat-icon>
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of displayedData; let rowIndex = index"
                  class="table-row"
                  [class.status-live-row]="row['status'] === 'Live'"
                  [class.status-pending-row]="row['status'] === 'P'"
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

      <!-- Loading indicator -->
      <div class="loading-container" *ngIf="isLoading">
        <div class="loading-spinner"></div>
        <span>Loading more data...</span>
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
      cursor: default;
      position: relative;
      /* Firefox scrollbar styling - header color matching */
      scrollbar-width: auto;
      scrollbar-color: #667eea #e2e8f0;
    }

    /* Webkit scrollbar - always visible track with header colors */
    .table-scroll-container::-webkit-scrollbar {
      width: 14px;
      height: 14px;
      -webkit-appearance: none;
      appearance: none;
    }

    .table-scroll-container::-webkit-scrollbar-track {
      background: #e2e8f0 !important;
      -webkit-appearance: none;
      appearance: none;
      border-radius: 0;
      margin: 2px;
    }

    .table-scroll-container::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      -webkit-appearance: none;
      appearance: none;
      border-radius: 7px;
      border: 2px solid #e2e8f0;
      min-height: 50px;
      transition: background 0.2s ease;
    }

    .table-scroll-container::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #5568d3 0%, #653a8f 100%) !important;
    }

    .table-scroll-container::-webkit-scrollbar-thumb:active {
      background: linear-gradient(135deg, #4a57c6 0%, #5a2f7f 100%) !important;
    }

    .table-scroll-container::-webkit-scrollbar-corner {
      background: #e2e8f0 !important;
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

    .header-content {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      width: 100%;
    }

    .sort-indicator {
      display: flex;
      align-items: center;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .sort-indicator.visible {
      opacity: 1;
    }

    .sort-icon {
      color: #94a3b8;
      transition: color 0.2s ease;
      font-size: 24px !important;
      width: 24px;
      height: 24px;
      line-height: 24px;
    }

    .sort-icon.active {
      color: #1a4da0;
    }

    .table-header-cell.sortable {
      cursor: pointer;
      user-select: none;
      transition: background 0.2s ease;
    }

    .table-header-cell.sortable:hover {
      background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
    }

    .table-header-cell.sortable:hover .sort-indicator {
      opacity: 1;
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
      transform: scale(1.01);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .status-live-row {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%) !important;
    }

    .status-live-row:hover {
      background: linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%) !important;
    }

    .status-pending-row {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%) !important;
    }

    .status-pending-row:hover {
      background: linear-gradient(135deg, #fde68a 0%, #fcd34d 100%) !important;
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

    /* Loading Styles */
    .loading-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem 2rem;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      flex-shrink: 0;
      color: #64748b;
      font-size: 0.875rem;
    }

    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #e2e8f0;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
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

      .loading-container {
        padding: 1rem;
        gap: 0.5rem;
        font-size: 0.8rem;
      }

      .loading-spinner {
        width: 24px;
        height: 24px;
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
export class SimpleTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() config!: SimpleTableConfig;
  @Input() data: any[] = [];
  @Input() batchSize: number = 50; // Number of items to load per batch

  @ViewChild('tableContainer') tableContainer!: ElementRef;
  @ViewChild('tableWrapper') tableWrapper!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  displayedData: any[] = [];
  currentBatch: number = 1;
  isLoading: boolean = false;
  hasMoreData: boolean = true;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'desc';
  hoveredColumn: string | null = null;
  sortedIconVisible = false;
  private sortedIconTimer: any = null;
  allData: any[] = [];

  ngOnInit() {
    this.allData = [...this.data];
    this.loadInitialData();
    this.adjustTableHeight();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange) {
      this.allData = [...this.data];
      // Reset sorting if needed
      if (this.sortColumn) {
        this.sortBy(this.sortColumn);
      } else {
        this.loadInitialData();
      }
    }
  }

  ngOnDestroy() {
    if (this.sortedIconTimer) {
      clearTimeout(this.sortedIconTimer);
    }
  }

  loadInitialData() {
    this.displayedData = this.allData.slice(0, this.batchSize);
    this.currentBatch = 1;
    this.hasMoreData = this.allData.length > this.displayedData.length;
  }

  loadMoreData() {
    if (this.isLoading || !this.hasMoreData) {
      return;
    }

    this.isLoading = true;
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const nextBatchStart = this.currentBatch * this.batchSize;
      const nextBatchEnd = nextBatchStart + this.batchSize;
      const newData = this.allData.slice(nextBatchStart, nextBatchEnd);
      
      this.displayedData = [...this.displayedData, ...newData];
      this.currentBatch++;
      this.hasMoreData = nextBatchEnd < this.allData.length;
      this.isLoading = false;
      
      this.adjustTableHeight();
    }, 300);
  }

  sortBy(columnKey: string) {
    // Toggle sort direction if clicking the same column, otherwise default to desc
    if (this.sortColumn === columnKey) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnKey;
      this.sortDirection = 'desc';
    }

    this.sortedIconVisible = true;
    if (this.sortedIconTimer) {
      clearTimeout(this.sortedIconTimer);
    }
    this.sortedIconTimer = setTimeout(() => {
      this.sortedIconVisible = false;
    }, 20000);

    // Sort all data
    this.allData.sort((a, b) => {
      const aVal = a[columnKey];
      const bVal = b[columnKey];
      
      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      
      // Handle numeric values
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return this.sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      // Handle string values
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (aStr < bStr) return this.sortDirection === 'asc' ? -1 : 1;
      if (aStr > bStr) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    // Reload data from sorted array
    this.currentBatch = 1;
    this.displayedData = this.allData.slice(0, this.batchSize);
    this.hasMoreData = this.allData.length > this.displayedData.length;
    
    this.adjustTableHeight();
  }

  getSortIcon(columnKey: string): string {
    if (this.sortColumn === columnKey) {
      return this.sortDirection === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down';
    }
    return 'arrow_drop_down';
  }

  onHeaderHover(columnKey: string) {
    this.hoveredColumn = columnKey;
    if (this.sortColumn === columnKey && this.sortedIconTimer) {
      clearTimeout(this.sortedIconTimer);
      this.sortedIconVisible = true;
    }
  }

  onHeaderLeave(columnKey: string) {
    if (this.sortColumn === columnKey) {
      this.sortedIconVisible = true;
      this.sortedIconTimer = setTimeout(() => {
        this.sortedIconVisible = false;
      }, 20000);
    }
    this.hoveredColumn = null;
  }

  onScroll() {
    if (!this.scrollContainer) {
      return;
    }

    const element = this.scrollContainer.nativeElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    
    // Trigger load more when user scrolls to 80% of the content
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    
    if (scrollPercentage >= 0.8 && this.hasMoreData && !this.isLoading) {
      this.loadMoreData();
    }
  }

  get totalRecords(): number {
    return this.allData.length;
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

      // Calculate content height (header + table content + loading indicator)
      const headerElement = container.querySelector('.table-header') as HTMLElement;
      const loadingElement = container.querySelector('.loading-container') as HTMLElement;
      const headerHeight = headerElement?.offsetHeight || 0;
      const loadingHeight = loadingElement?.offsetHeight || 0;
      const tableContentHeight = this.calculateTableContentHeight();

      const totalContentHeight = headerHeight + tableContentHeight + loadingHeight;

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
    const visibleRows = this.displayedData.length;
    return headerHeight + (visibleRows * rowHeight);
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
