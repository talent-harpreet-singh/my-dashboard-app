import { Component, Input } from "@angular/core";
import { RuleDetails } from "../../models/rule.model";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TierProfileModalComponent } from "../tier-profile-modal/tier-profile-modal.component";

@Component({
  selector: 'app-form-inputs',
  templateUrl: './form-inputs.component.html',
  styleUrls: ['./form-inputs.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, TierProfileModalComponent]
})
export class FormInputsComponent {
  @Input() formData!: RuleDetails;

  showTierProfileModal = false;

  tierProfiles = [
    { id: 182, name: '8.5 PERCENT (182)' },
    { id: 183, name: '5.5 PERCENT (183)' },
    { id: 184, name: '9.5 PERCENT (184)' },
    { id: 186, name: '0% PROFILE (186)' },
    { id: 198, name: '400% NO BAL (198)' },
    { id: 334, name: 'STD 1% (334)' },
    { id: 335, name: 'STD 100% (335)' },
    { id: 337, name: 'STD 2% (337)' },
    { id: 338, name: 'STD 20% (338)' },
    { id: 342, name: 'STD 4% (342)' },
    { id: 343, name: 'STD 5% (343)' },
    { id: 344, name: 'STD 3% (344)' },
    { id: 347, name: 'STD 200% (347)' },
    { id: 349, name: 'STD 1340% (349)' },
  ];

  openTierModal() {
    this.showTierProfileModal = true;
  }

  setTierProfile(value: string) {
    this.formData.tierProfile = value;
  }

  onChange(field: keyof RuleDetails, event: Event) {
    const value = (event.target as HTMLInputElement | HTMLSelectElement).value;
    (this.formData as any)[field] = typeof this.formData[field] === 'number' ? +value : value;
  }
}
