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
        [showAddRowButton]="true"
        [showSaveButton]="true"
        (exportClick)="exportToExcel($event)"
        (cellClick)="onPromoIdClick($event)"
        (addRowClick)="onAddRow()"
        (saveClick)="onSave($event)"
      ></app-simple-table>
    </div>
  `,
  styles: [`
    .pr-bonus-rules-wrapper {
      position: relative;
      width: 100%;
    }
  `]
})
export class PrBonusRulesComponent {
  batchSize: number = 30; // Load 30 items at a time
  exportFileName = 'PR_Bonus_Rules.xlsx';

  constructor(private router: Router) {}

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
    if (event.column === 'promoId' && !event.row._isNew) {
      // Navigate to detail page with row data (only for existing rows)
      this.router.navigate(['/pr-bonus-rules/detail'], {
        state: event.row
      });
    }
  }

  onAddRow(): void {
    // Generate a new promo ID (increment from the highest existing one)
    const maxPromoId = Math.max(...this.bonusRules
      .filter(r => !isNaN(Number(r.promoId)))
      .map(r => Number(r.promoId)), 0);
    const newPromoId = String(maxPromoId + 1).padStart(8, '0');

    const newRow = {
      promoId: newPromoId,
      lob: 1,
      displayName: '',
      status: 'Live',
      userId: '',
      lastUpdateDate: this.getCurrentDate(),
      _isNew: true // Mark as new row
    };

    // Add to the beginning of the array so it appears at the top
    this.bonusRules = [newRow, ...this.bonusRules];
  }

  onSave(data: any[]): void {
    // Remove the _isNew and _isModified flags and save
    const cleanedData = data.map(row => {
      const { _isNew, _isModified, ...cleanRow } = row;
      // If it was a new row, mark it as saved
      if (_isNew) {
        cleanRow.lastUpdateDate = this.getCurrentDate();
      }
      return cleanRow;
    });

    // Update the bonusRules array
    this.bonusRules = cleanedData.map(row => ({
      ...row,
      _isNew: false,
      _isModified: false
    }));

    // TODO: Here you would typically make an API call to save the data
    console.log('Saving data:', cleanedData);
    alert(`Successfully saved ${data.filter(r => r._isNew).length} new row(s)!`);
  }

  getCurrentDate(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    const displayHours = now.getHours() % 12 || 12;
    return `${month}-${day}-${year} ${displayHours}:${minutes}:${seconds} ${ampm}`;
  }
}
