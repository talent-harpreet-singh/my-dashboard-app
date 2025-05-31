import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RuleEditorComponent } from './components/rule-editor/rule-editor.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  // { path: '**', redirectTo: '' },
  { path: 'rule-editor', component: RuleEditorComponent }
];
