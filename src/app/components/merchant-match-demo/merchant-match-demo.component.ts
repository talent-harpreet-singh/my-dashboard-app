import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchantMatchTableComponent, MerchantMatch } from '../merchant-match-table/merchant-match-table.component';

@Component({
  selector: 'app-merchant-match-demo',
  standalone: true,
  imports: [CommonModule, MerchantMatchTableComponent],
  template: `
    <app-merchant-match-table
      [data]="currentData"
      [businessType]="businessType"
      (dataChange)="onDataChange($event)"
      (businessTypeChange)="onBusinessTypeChange($event)"
      (rowUpdate)="onRowUpdate($event)"
      (rowReject)="onRowReject($event)"
      (rowConfirm)="onRowConfirm($event)"
    ></app-merchant-match-table>
  `
})
export class MerchantMatchDemoComponent {
  businessType: 'consumer' | 'smallBusiness' = 'consumer';
  
  // Consumer sample data
  consumerData: MerchantMatch[] = [
    {
      matchCharCount: 5,
      startDate: '03-18-2025',
      endDate: '12-31-9999',
      status: 'Live',
      userId: 'NBKL6AO',
      lastUpdatedDate: '03-18-2025 08:50:21 AM'
    },
    {
      matchCharCount: 5,
      startDate: '05-14-2027',
      endDate: '12-31-9999',
      status: 'P',
      userId: 'NBK5EC1',
      lastUpdatedDate: '12-11-2025 03:06:16 PM'
    },
    {
      matchCharCount: 5,
      startDate: '02-16-2025',
      endDate: '02-17-2025',
      status: 'Live',
      userId: 'NBKB6MY',
      lastUpdatedDate: '02-19-2025 01:23:11 PM'
    }
  ];
  
  // Small Business sample data
  smallBusinessData: MerchantMatch[] = [
    {
      matchCharCount: 8,
      startDate: '01-01-2025',
      endDate: '12-31-9999',
      status: 'Live',
      userId: 'SBKM4RT',
      lastUpdatedDate: '01-05-2025 10:22:45 AM'
    },
    {
      matchCharCount: 6,
      startDate: '03-01-2025',
      endDate: '06-30-2025',
      status: 'P',
      userId: 'SBKJ7PL',
      lastUpdatedDate: '02-28-2025 02:15:33 PM'
    },
    {
      matchCharCount: 10,
      startDate: '04-15-2025',
      endDate: '12-31-9999',
      status: 'Live',
      userId: 'SBKN2WX',
      lastUpdatedDate: '04-10-2025 09:45:12 AM'
    },
    {
      matchCharCount: 4,
      startDate: '02-01-2025',
      endDate: '12-31-9999',
      status: 'P',
      userId: 'SBKR8QZ',
      lastUpdatedDate: '01-30-2025 04:30:00 PM'
    }
  ];
  
  // Current data based on selection
  get currentData(): MerchantMatch[] {
    return this.businessType === 'consumer' ? this.consumerData : this.smallBusinessData;
  }
  
  onDataChange(data: MerchantMatch[]): void {
    if (this.businessType === 'consumer') {
      this.consumerData = data;
    } else {
      this.smallBusinessData = data;
    }
    console.log('Data changed:', data);
  }
  
  onBusinessTypeChange(type: 'consumer' | 'smallBusiness'): void {
    this.businessType = type;
    console.log('Business type changed:', type);
  }
  
  onRowUpdate(event: { row: MerchantMatch; index: number }): void {
    console.log('Update row:', event);
    alert(`Updating row ${event.index + 1}: Match Char Count = ${event.row.matchCharCount}`);
  }
  
  onRowReject(event: { row: MerchantMatch; index: number }): void {
    console.log('Reject row:', event);
    alert(`Rejecting changes for row ${event.index + 1}`);
  }
  
  onRowConfirm(event: { row: MerchantMatch; index: number }): void {
    console.log('Confirm row:', event);
    alert(`Confirming row ${event.index + 1}`);
  }
}
