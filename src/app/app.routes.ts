import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RuleEditorComponent } from './components/rule-editor/rule-editor.component';
import { PrBonusRulesComponent } from './components/pr-bonus-model/pr-bonus-rules.component';
import { TabDemoComponent } from './components/tab-demo/tab-demo.component';
import { DynamicFormDemoComponent } from './components/dynamic-form-demo/dynamic-form-demo.component';
import { TierProfileDetailsComponent } from './components/tier-profile-details/tier-profile-details.component';
import { DynamicTableDemoComponent } from './components/dynamic-table-demo/dynamic-table-demo.component';
import { MerchantMatchDemoComponent } from './components/merchant-match-demo/merchant-match-demo.component';
import { StatementCreditDemoComponent } from './components/statement-credit-demo/statement-credit-demo.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  // { path: '**', redirectTo: '' },
  { path: 'rule-editor', component: RuleEditorComponent },
  { path: 'reports', component: PrBonusRulesComponent },
  { path: 'tab-demo', component: TabDemoComponent },
  { path: 'dynamic-form-demo', component: DynamicFormDemoComponent },
  { path: 'tier-profile-details', component: TierProfileDetailsComponent },
  { path: 'dynamic-table-demo', component: DynamicTableDemoComponent },
  { path: 'merchant-match', component: MerchantMatchDemoComponent },
  { path: 'statement-credit', component: StatementCreditDemoComponent }
];
