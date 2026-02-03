import { Component, Input } from "@angular/core";
import { RuleDetails } from "../../models/rule.model";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-rule-details',
  templateUrl: './rule-details.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class RuleDetailsComponent {
  @Input() details!: RuleDetails;

  hasDetails(): boolean {
    return !!(this.details?.lastUpdatedDate || this.details?.status || this.details?.userId);
  }
}
