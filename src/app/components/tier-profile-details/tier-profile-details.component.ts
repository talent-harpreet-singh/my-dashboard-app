import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TierRow {
  endPoint: string;
  standard: number;
  balance: number;
}

@Component({
  selector: 'app-tier-profile-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tier-profile-details.component.html'
})
export class TierProfileDetailsComponent {
  profileName: string = '';
  notes: string = '';
  statementCreditFulfillment: boolean = false;
  valueType: 'percent' | 'amount' = 'amount';

  tierRows: TierRow[] = Array(13).fill(null).map(() => ({
    endPoint: '',
    standard: 0.00,
    balance: 0.00
  }));

  onSave(): void {
    const data = {
      profileName: this.profileName,
      notes: this.notes,
      statementCreditFulfillment: this.statementCreditFulfillment,
      valueType: this.valueType,
      tierRows: this.tierRows
    };
    console.log('Saving Tier Profile:', data);
    alert('Tier Profile saved successfully!');
  }

  onCancel(): void {
    this.profileName = '';
    this.notes = '';
    this.statementCreditFulfillment = false;
    this.valueType = 'amount';
    this.tierRows = Array(13).fill(null).map(() => ({
      endPoint: '',
      standard: 0.00,
      balance: 0.00
    }));
  }
}

