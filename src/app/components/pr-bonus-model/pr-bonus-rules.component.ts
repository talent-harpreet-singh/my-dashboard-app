import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SimpleTableComponent } from '../table/table.component';
import { exportTableToExcel } from '../../utils/excel-export.util';

@Component({
  selector: 'app-pr-bonus-rules',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, SimpleTableComponent],
  template: `
    <div class="pr-bonus-rules-wrapper">
      <app-simple-table
        [config]="tableConfig"
        [data]="bonusRules"
        [batchSize]="batchSize"
        [tableId]="'prBonusRulesTable'"
        [showExportButton]="true"
        (exportClick)="exportToExcel($event)"
        (cellClick)="onPromoIdClick($event)"
      ></app-simple-table>
      <div class="action-footer">
        <button class="new-rule-btn" (click)="onNewRuleClick()">
          <mat-icon>add</mat-icon>
          <span>New Rule</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .pr-bonus-rules-wrapper {
      position: relative;
      width: 100%;
    }

    .action-footer {
      display: flex;
      justify-content: flex-end;
      padding: 1.5rem 2rem;
      margin-top: 1rem;
    }

    .new-rule-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
    }

    .new-rule-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
    }

    .new-rule-btn:active {
      transform: translateY(0);
    }

    .new-rule-btn mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  `]
})
export class PrBonusRulesComponent {
  batchSize: number = 30; // Load 30 items at a time
  exportFileName = 'PR_Bonus_Rules.xlsx';

  tableConfig = {
    title: 'PR Bonus Rules',
    columns: [
      { key: 'promoId', header: 'Promo Id', width: '120px', sortable: true, clickable: true },
      { key: 'lob', header: 'LOB', width: '80px', sortable: true },
      { key: 'displayName', header: 'Display Name', sortable: true },
      { key: 'status', header: 'Status', width: '100px', sortable: true },
      { key: 'userId', header: 'User ID', width: '120px', sortable: true },
      { key: 'lastUpdateDate', header: 'Last Update Date', width: '180px', sortable: true }
    ]
  };

  constructor(private router: Router) {}

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

  exportToExcel(tableId: string): void {
    exportTableToExcel(tableId, this.exportFileName, 'PR Bonus Rules');
  }

  onPromoIdClick(event: { column: string; row: any }): void {
    if (event.column === 'promoId') {
      // Navigate to rule-editor with row data
      this.router.navigate(['/rule-editor'], {
        state: event.row
      });
    }
  }

  onNewRuleClick(): void {
    // Navigate to rule-editor without any pre-filled data
    this.router.navigate(['/rule-editor'], {
      queryParams: { new: 'true' }
    });
  }
}
