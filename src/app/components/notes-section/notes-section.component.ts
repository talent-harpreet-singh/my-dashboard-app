import { Component, Input } from '@angular/core';
import { Note } from '../../models/rule.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notes-section',
  templateUrl: './notes-section.component.html',
  styleUrls: ['./notes-section.component.css'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule]
})
export class NotesSectionComponent {
  @Input() notes: Note[] = [];

  addNote(): void {
    const newNote: Note = {
      seqNo: this.notes.length + 1,
      note: '',
      userId: 'ZKYSZI6', // You can dynamically assign this in real case
      lastUpdated: new Date().toLocaleString()
    };
    this.notes.push(newNote);
  }

  onEdit(field: keyof Note, note: Note, value: string) {
    (note as any)[field] = value;
    if (field === 'note') {
      note.lastUpdated = new Date().toLocaleString();
    }
  }
}