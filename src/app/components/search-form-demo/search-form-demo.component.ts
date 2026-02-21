import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFormComponent } from '../common/search-form/search-form.component';
import { SearchFormConfig } from '../../models/search-form.model';

@Component({
  selector: 'app-search-form-demo',
  standalone: true,
  imports: [CommonModule, SearchFormComponent],
  template: `
    <div class="demo-container">
      <h1>Search Form Examples</h1>
      
      <div class="example-section">
        <h2>Example 1: Redemption Search </h2>
        <app-search-form
          [config]="redemptionSearchConfig"
          (search)="onRedemptionSearch($event)"
          (reset)="onRedemptionReset()"
        ></app-search-form>
      </div>

      <div class="example-section">
        <h2>Example 2: Custom Search Form </h2>
        <app-search-form
          [config]="customSearchConfig"
          (search)="onCustomSearch($event)"
          (reset)="onCustomReset()"
        ></app-search-form>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      width: 88rem;
      max-width: 100%;
      min-height: 100vh;
      margin: 0;
      padding: 0;
      background: #f5f5f5;
    }
    
    .demo-container h1 {
      text-align: center;
      color: #1a4da0;
      margin: 0;
      padding: 20px 0;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .example-section {
      margin: 2rem;
      padding: 0;
      border: none;
      border-radius: 0;
      background: transparent;
    }
    
    .example-section h2 {
      color: #333;
      margin: 0 0 1.5rem 0;
      padding: 20px;
      background: white;
      border-bottom: 1px solid #e0e0e0;
      font-size: 1.3rem;
    }
  `]
})
export class SearchFormDemoComponent {
  redemptionSearchConfig: SearchFormConfig = {
    title: 'Redemption Search',
    subtitle: 'Find Redemption',
    fields: [
      {
        key: 'level',
        label: 'Level',
        type: 'select',
        options: [
          { value: '', label: 'Any' }
        ]
      },
      {
        key: 'redemptionNo',
        label: 'Redemption No',
        type: 'text',
        placeholder: ''
      },
      {
        key: 'legacyCode',
        label: 'Legacy Code',
        type: 'range',
        options: [
          { value: '', label: 'Any' }
        ],
        rangeFields: {
          from: 'legacyCodeFrom',
          to: 'legacyCodeTo'
        }
      },
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        options: [
          { value: '', label: 'Any' }
        ]
      },
      {
        key: 'userId',
        label: 'User Id',
        type: 'text',
        placeholder: ''
      },
      {
        key: 'type',
        label: 'Type',
        type: 'select',
        options: [
          { value: '', label: 'Any' }
        ]
      },
      {
        key: 'nameContains',
        label: 'Name Contains',
        type: 'text',
        placeholder: ''
      }
    ],
    buttonLabels: {
      find: 'Find',
      reset: 'Reset'
    }
  };

  customSearchConfig: SearchFormConfig = {
    title: 'Custom Search',
    subtitle: 'Search with Custom Fields',
    fields: [
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: '', label: 'All' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' }
        ]
      },
      {
        key: 'searchTerm',
        label: 'Search Term',
        type: 'text',
        placeholder: 'Enter search term...'
      }
    ],
    buttonLabels: {
      find: 'Search',
      reset: 'Clear'
    }
  };

  onRedemptionSearch(searchData: any): void {
    console.log('Redemption Search Data:', searchData);
    alert('Search triggered! Check console for data.\n\n' + JSON.stringify(searchData, null, 2));
  }

  onRedemptionReset(): void {
    console.log('Redemption Search Reset');
    alert('Form has been reset!');
  }

  onCustomSearch(searchData: any): void {
    console.log('Custom Search Data:', searchData);
    alert('Custom Search triggered! Check console for data.\n\n' + JSON.stringify(searchData, null, 2));
  }

  onCustomReset(): void {
    console.log('Custom Search Reset');
    alert('Form has been reset!');
  }
}
