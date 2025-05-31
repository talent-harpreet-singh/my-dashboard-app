import { Component, Input } from "@angular/core";
import { RuleDetails } from "../../models/rule.model";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-form-inputs',
  templateUrl: './form-inputs.component.html',
  styleUrls: ['./form-inputs.component.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class FormInputsComponent {
  @Input() formData!: RuleDetails;

  onChange(field: keyof RuleDetails, event: Event) {
    const value = (event.target as HTMLInputElement | HTMLSelectElement).value;
    (this.formData as any)[field] = typeof this.formData[field] === 'number' ? +value : value;
  }
}
