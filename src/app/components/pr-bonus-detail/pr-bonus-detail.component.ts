import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface PrBonusRuleData {
  promoId: string;
  lob: number;
  displayName: string;
  status: string;
  userId: string;
  lastUpdateDate: string;
}

@Component({
  selector: 'app-pr-bonus-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  template: `
    <div class="detail-container">
      <div class="detail-header">
        <h2 class="detail-title">PR Bonus Rule Details</h2>
        <button class="back-button" (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          <span>Back to List</span>
        </button>
      </div>

      <div class="form-container">
        <form class="bonus-rule-form">
          <div class="form-group">
            <label class="form-label">Promo ID</label>
            <input 
              type="text" 
              class="form-control" 
              [(ngModel)]="formData.promoId" 
              name="promoId"
              readonly
            />
          </div>

          <div class="form-group">
            <label class="form-label">LOB</label>
            <input 
              type="number" 
              class="form-control" 
              [(ngModel)]="formData.lob" 
              name="lob"
            />
          </div>

          <div class="form-group full-width">
            <label class="form-label">Display Name</label>
            <input 
              type="text" 
              class="form-control" 
              [(ngModel)]="formData.displayName" 
              name="displayName"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Status</label>
            <select 
              class="form-control" 
              [(ngModel)]="formData.status" 
              name="status"
            >
              <option value="Live">Live</option>
              <option value="P">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">User ID</label>
            <input 
              type="text" 
              class="form-control" 
              [(ngModel)]="formData.userId" 
              name="userId"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Last Update Date</label>
            <input 
              type="text" 
              class="form-control" 
              [(ngModel)]="formData.lastUpdateDate" 
              name="lastUpdateDate"
              readonly
            />
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-primary" (click)="saveForm()">
              <mat-icon>save</mat-icon>
              <span>Save</span>
            </button>
            <button type="button" class="btn btn-secondary" (click)="cancelForm()">
              <mat-icon>cancel</mat-icon>
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .detail-container {
      padding: 2rem;
      max-width: 95%;
      width: 100%;
      margin: 0 auto;
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      min-height: calc(100vh - 100px);
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e2e8f0;
    }

    .detail-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .back-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .back-button:hover {
      background: #5568d3;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
    }

    .back-button mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .form-container {
      background: white;
      border-radius: 12px;
      padding: 2.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .bonus-rule-form {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group.full-width,
    .form-group:last-of-type,
    .form-actions {
      grid-column: 1 / -1;
    }

    .form-label {
      font-weight: 600;
      color: #334155;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-control {
      padding: 0.75rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s ease;
      background: white;
      width: 100%;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-control:read-only {
      background: #f1f5f9;
      cursor: not-allowed;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
    }

    .btn-secondary {
      background: #e2e8f0;
      color: #334155;
    }

    .btn-secondary:hover {
      background: #cbd5e1;
    }

    .btn mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    @media (max-width: 968px) {
      .bonus-rule-form {
        grid-template-columns: 1fr;
      }

      .form-group:last-of-type,
      .form-actions {
        grid-column: 1;
      }
    }

    @media (max-width: 768px) {
      .detail-container {
        padding: 1rem;
        max-width: 100%;
      }

      .detail-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .form-container {
        padding: 1.5rem;
      }
    }
  `]
})
export class PrBonusDetailComponent implements OnInit {
  formData: PrBonusRuleData = {
    promoId: '',
    lob: 0,
    displayName: '',
    status: '',
    userId: '',
    lastUpdateDate: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.formData = { ...navigation.extras.state as PrBonusRuleData };
    } else {
      const state = history.state;
      if (state && state.promoId) {
        this.formData = {
          promoId: state.promoId || '',
          lob: state.lob || 0,
          displayName: state.displayName || '',
          status: state.status || '',
          userId: state.userId || '',
          lastUpdateDate: state.lastUpdateDate || ''
        };
      } else {
        console.warn('No data found, redirecting to list');
        this.goBack();
      }
    }
  }

  goBack() {
    this.router.navigate(['/reports']);
  }

  saveForm() {
    // TODO: Implement save functionality
    console.log('Saving form data:', this.formData);
    alert('Form saved successfully!');
  }

  cancelForm() {
    this.goBack();
  }
}
