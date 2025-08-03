import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RuleEditorComponent } from './components/rule-editor/rule-editor.component';
import { PrBonusRulesComponent } from './components/pr-bonus-model/pr-bonus-rules.component';
import { TabDemoComponent } from './components/tab-demo/tab-demo.component';
import { DynamicFormDemoComponent } from './components/dynamic-form-demo/dynamic-form-demo.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  // { path: '**', redirectTo: '' },
  { path: 'rule-editor', component: RuleEditorComponent },
  { path: 'reports', component: PrBonusRulesComponent },
  { path: 'tab-demo', component: TabDemoComponent },
  { path: 'dynamic-form-demo', component: DynamicFormDemoComponent }
];
