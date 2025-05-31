import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

// Import your components
import { NavbarComponent } from './components/navbar/navbar.component'; // Adjust this based on actual filename
import { RuleEditorComponent } from './components/rule-editor/rule-editor.component';
import { RuleDetailsComponent } from './components/rule-details/rule-details.component';
import { FormInputsComponent } from './components/form-inputs/form-inputs.component';
import { ProgramsTableComponent } from './components/programs-table/programs-table.component';
import { NotesSectionComponent } from './components/notes-section/notes-section.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    RouterModule.forRoot([]),
    RuleEditorComponent,
    RuleDetailsComponent,
    FormInputsComponent,
    ProgramsTableComponent,
    NotesSectionComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
