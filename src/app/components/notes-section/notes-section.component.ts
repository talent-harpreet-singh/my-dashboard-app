import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Note } from '../../models/rule.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notes-section',
  templateUrl: './notes-section.component.html',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule]
})
export class NotesSectionComponent {
  @Input() notes: (Note & { isNew?: boolean })[] = [];
  @Output() noteAdded = new EventEmitter<void>();
  @Input() showDelete: boolean = true;
  addNote(): void {
    const newNote: Note = {
      seqNo: this.notes.length + 1,
      note: '',
      userId: 'ZKYSZI6',
      lastUpdated: new Date().toLocaleString(),
      isNew: true
    };
    this.notes.push(newNote);
    this.noteAdded.emit();
  }

  deleteNote(note: Note): void {
    this.notes = this.notes.filter(n => n !== note);
    this.recalculateSequence();
  }


  recalculateSequence(): void {
    this.notes.forEach((note, index) => {
      note.seqNo = index + 1;
    });
  }


  onEdit(field: keyof Note, note: Note, value: string) {
    (note as any)[field] = value;
    if (field === 'note') {
      note.lastUpdated = new Date().toLocaleString();
    }
  }
}