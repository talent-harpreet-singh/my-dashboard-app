import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SimpleTableComponent } from '../table/table.component';
import { exportToExcel, createColumnsFromTableConfig, ExcelExportOptions } from '../../utils/excel-export.util';

@Component({
  selector: 'app-pr-bonus-rules',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, SimpleTableComponent],
  template: `
    <div class="pr-bonus-rules-wrapper">
      <!-- Loading Overlay -->
      <div class="export-loading-overlay" *ngIf="isExporting">
        <div class="export-loading-content">
          <mat-spinner diameter="50"></mat-spinner>
          <p class="loading-text">Exporting {{ bonusRules.length }} records...</p>
          <p class="loading-subtext">Please wait, this may take a moment</p>
        </div>
      </div>
      
      <app-simple-table
        [config]="tableConfig"
        [data]="bonusRules"
        [batchSize]="batchSize"
        [tableId]="'prBonusRulesTable'"
        [showExportButton]="true"
        [isExporting]="isExporting"
        (exportClick)="exportToExcel($event)"
      ></app-simple-table>
    </div>
  `,
  styles: [`
    .pr-bonus-rules-wrapper {
      position: relative;
      width: 100%;
    }

    .export-loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      animation: fadeIn 0.2s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .export-loading-content {
      background: white;
      border-radius: 16px;
      padding: 2rem 3rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      max-width: 400px;
      text-align: center;
    }

    .loading-text {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .loading-subtext {
      margin: 0;
      font-size: 0.875rem;
      color: #64748b;
    }
  `]
})
export class PrBonusRulesComponent {
  batchSize: number = 30; // Load 30 items at a time
  exportFileName = 'PR_Bonus_Rules.xlsx';
  isExporting: boolean = false;

  tableConfig = {
    title: 'PR Bonus Rules',
    columns: [
      { key: 'promoId', header: 'Promo Id', width: '120px', sortable: true },
      { key: 'lob', header: 'LOB', width: '80px', sortable: true },
      { key: 'displayName', header: 'Display Name', sortable: true },
      { key: 'status', header: 'Status', width: '100px', sortable: true },
      { key: 'userId', header: 'User ID', width: '120px', sortable: true },
      { key: 'lastUpdateDate', header: 'Last Update Date', width: '180px', sortable: true }
    ]
  };

  bonusRules = [
    {
      promoId: '20000001',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 25% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:16:49 AM'
    },
    {
      promoId: '20000001',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 25% Bonus',
      status: 'P',
      userId: 'ZKH2VK2',
      lastUpdateDate: '06-17-2025 12:24:08 PM'
    },
    {
      promoId: '20000002',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 50% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:16:57 AM'
    },
    {
      promoId: '20000002',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 50% Bonus',
      status: 'P',
      userId: 'ZKH2VK2',
      lastUpdateDate: '06-02-2025 3:43:02 PM'
    },
    {
      promoId: '20000003',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    },
    {
      promoId: '20000003',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    },
    {
      promoId: '20000004',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    },
    {
      promoId: '20000004',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    },
    {
      promoId: '20000004',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    },    {
      promoId: '20000004',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    },    {
      promoId: '20000004',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    },    {
      promoId: '20000004',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    },    {
      promoId: '20000004',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    },    {
      promoId: '20000004',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    }   , {
      promoId: '20000004',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    },
    {
      promoId: '20000004',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    },
    {
      promoId: '20000004',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    },    {
      promoId: '20000004',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    },    {
      promoId: '20000004',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    },    {
      promoId: '20000004',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    },    {
      promoId: '20000004',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    },    {
      promoId: '20000004',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    },
    {
      promoId: '20000004',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    },
    {
      promoId: '20000004',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    },
    {
      promoId: '20000004',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    },
    {
      promoId: '20000004',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    },
    {
      promoId: '20000004',
      lob: 1,
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 75% Bonus',
      status: 'Live',
      userId: 'NBKBT4I',
      lastUpdateDate: '11-05-2021 9:17:05 AM'
    }

  ];

  async exportToExcel(tableId: string): Promise<void> {
    if (this.isExporting) {
      return;
    }

    try {
      this.isExporting = true;

      await new Promise(resolve => setTimeout(resolve, 100));

      const columns = createColumnsFromTableConfig(this.tableConfig.columns);

      const exportOptions: ExcelExportOptions = {
        fileName: this.exportFileName,
        sheetName: 'PR Bonus Rules',
        columns: columns,
        data: this.bonusRules,
        freezeHeaderRow: true,
        compression: true,
        cellStyles: false,
        chunkSize: 1000,
        onProgress: (progress) => {
          console.log(`Export progress: ${progress.percentage}% (${progress.current}/${progress.total})`);
        }
      };

      const result = await exportToExcel(exportOptions);

      if (!result.success) {
        throw new Error(result.error || 'Export failed');
      }

    } catch (error) {
      console.error('Error exporting to Excel:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An error occurred while exporting the data. Please try again or contact support if the problem persists.';
      
      alert(errorMessage);
      
      throw error;
    } finally {
      this.isExporting = false;
    }
  }
}
