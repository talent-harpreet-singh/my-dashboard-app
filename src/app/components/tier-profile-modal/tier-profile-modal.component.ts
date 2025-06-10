import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tier-profile-modal',
  templateUrl: './tier-profile-modal.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class TierProfileModalComponent {
    @Input() title: string = 'Modal Table';
    @Input() columns: string[] = [];
    @Input() displayKeys: string[] = [];
    @Input() data: any[] = [];

    @Output() rowClick = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    @HostListener('document:click', ['$event'])
    closeOnOutsideClick(event: MouseEvent) {
      const path = event.composedPath();
      const inside = path.some((p: any) => p.classList?.contains('modal-container'));
      if (!inside) {
        this.cancel.emit();
      }
    }

    handleRowClick(row: any) {
      this.rowClick.emit(row);
    }
  }
