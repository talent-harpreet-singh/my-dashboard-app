import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tier-profile-modal',
  templateUrl: './tier-profile-modal.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class TierProfileModalComponent {
  @Input() tierProfiles: { id: number, name: string }[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() selectTier = new EventEmitter<string>();

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const path: EventTarget[] = event.composedPath();
    // Only close if outside this modal container
    const isClickInside = path.some((el: any) => el.classList?.contains('modal-container'));
    if (!isClickInside) {
      this.close.emit();
    }
  }

  onSelect(tierName: string) {
    this.selectTier.emit(tierName);
    this.close.emit();
  }
}
