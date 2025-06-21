import { Component } from '@angular/core';
import { SimpleTableComponent } from '../table/table.component';

@Component({
  selector: 'app-pr-bonus-rules',
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <app-simple-table
      [config]="tableConfig"
      [data]="bonusRules"
    ></app-simple-table>
  `
})
export class PrBonusRulesComponent {
  tableConfig = {
    title: 'PR Bonus Rules',
    columns: [
      { key: 'promoId', header: 'Promo Id', width: '120px' },
      { key: 'lob', header: 'LOB', width: '80px' },
      { key: 'displayName', header: 'Display Name' },
      { key: 'status', header: 'Status', width: '100px' },
      { key: 'userId', header: 'User ID', width: '120px' },
      { key: 'lastUpdateDate', header: 'Last Update Date', width: '180px' }
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
}
