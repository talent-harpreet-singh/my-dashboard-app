import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { RuleDetails, Program, Note } from '../../models/rule.model';
import { FormInputsComponent } from '../form-inputs/form-inputs.component';
import { ProgramsTableComponent } from '../programs-table/programs-table.component';
import { NotesSectionComponent } from '../notes-section/notes-section.component';
import { RuleDetailsComponent } from '../rule-details/rule-details.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

const LOCAL_STORAGE_KEY = 'ruleEditorData';

@Component({
  selector: 'app-rule-editor',
  templateUrl: './rule-editor.component.html',
  styleUrls: ['./rule-editor.component.scss'],
  imports: [FormInputsComponent, ProgramsTableComponent, NotesSectionComponent, RuleDetailsComponent, CommonModule, MatButtonModule, MatIconModule],
  standalone: true
})
export class RuleEditorComponent implements OnInit {
  ruleDetails!: RuleDetails;
  programs!: Program[];
  notes!: Note[];
  showDelete: boolean = true;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      this.ruleDetails = parsed.ruleDetails;
      this.programs = parsed.programs;
      this.notes = parsed.notes;
    } else {
      this.ruleDetails = this.dataService.getRuleDetails();
      this.programs = this.dataService.getPrograms();
      this.notes = this.dataService.getNotes();
    }
  }

  onNoteAdded(): void {
    this.showDelete = true;
  }


  saveLocally(): void {

    this.notes = this.notes.map(note => {
      const { isNew, ...cleanNote } = note;
      return cleanNote;
    });

    const data = {
      ruleDetails: this.ruleDetails,
      programs: this.programs,
      notes: this.notes
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    this.showDelete = false;
    alert('Saved locally!');
  }

  clearStorage(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    window.location.reload();
  }
}
