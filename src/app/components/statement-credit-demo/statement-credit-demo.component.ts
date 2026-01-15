import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatementCreditComponent, StatementCreditData } from '../statement-credit/statement-credit.component';

@Component({
  selector: 'app-statement-credit-demo',
  standalone: true,
  imports: [CommonModule, StatementCreditComponent],
  template: `
    <app-statement-credit
      [data]="statementCreditData"
      (dataChange)="onDataChange($event)"
      (update)="onUpdate($event)"
      (saveAsClone)="onSaveAsClone($event)"
      (cancel)="onCancel()"
    ></app-statement-credit>
  `
})
export class StatementCreditDemoComponent {
  // Sample data matching the screenshot
  statementCreditData: StatementCreditData = {
    lastUpdatedDate: '02-17-2013 01:14:47 AM',
    status: 'Live',
    userId: '905Y5DXP',
    notes: 'DO NOT USE',
    statementCreditFulfillment: false,
    calculationType: 'percent',
    rows: [
      {
        endPoint: 0,
        standardPercent: 100,
        balancePercent: 150
      },
      {
        endPoint: 9999999.99,
        standardPercent: 100,
        balancePercent: 150
      }
    ]
  };
  
  onDataChange(data: StatementCreditData): void {
    this.statementCreditData = data;
    console.log('Data changed:', data);
  }
  
  onUpdate(data: StatementCreditData): void {
    console.log('Update clicked:', data);
  }
  
  onSaveAsClone(data: StatementCreditData): void {
    console.log('SaveAs/Clone clicked:', data);
  }
  
  onCancel(): void {
    console.log('Cancel clicked');
  }
}
