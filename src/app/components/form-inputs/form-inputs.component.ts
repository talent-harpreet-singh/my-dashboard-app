// components/form-inputs/form-inputs.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '../common/dynamic-form/dynamic-form.component';
import { TierProfileModalComponent } from '../tier-profile-modal/tier-profile-modal.component';
import { RuleDetails } from '../../models/rule.model';
import { FormField } from '../../models/form-model';

@Component({
  selector: 'app-form-inputs',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent, TierProfileModalComponent],
  templateUrl: './form-inputs.component.html',
  styleUrls: ['../../styles/form-inputs.component.scss']
})
export class FormInputsComponent {
  @Input() formData!: RuleDetails;

  showModal = false;
  activeModal: FormField | null = null;

  tierProfiles = [
    { id: 182, name: '8.5 PERCENT (182)', extraValue: '182' },
    { id: 183, name: '5.5 PERCENT (183)', extraValue: '183' },
    { id: 184, name: '9.5 PERCENT (184)', extraValue: '184' },
    { id: 186, name: '0% PROFILE (186)', extraValue: '186' },
    { id: 198, name: '400% NO BAL (198)', extraValue: '198' },
    { id: 334, name: 'STD 1% (334)', extraValue: '334' },
    { id: 335, name: 'STD 100% (335)', extraValue: '335' },
    { id: 337, name: 'STD 2% (337)', extraValue: '337' },
    { id: 338, name: 'STD 20% (338)', extraValue: '338' },
    { id: 342, name: 'STD 4% (342)', extraValue: '342' },
    { id: 343, name: 'STD 5% (343)', extraValue: '343' },
    { id: 344, name: 'STD 3% (344)', extraValue: '344' },
    { id: 347, name: 'STD 200% (347)', extraValue: '347' },
    { id: 349, name: 'STD 1340% (349)', extraValue: '349' },
  ];

  get metadata() {
    return [
      { label: 'Last Updated', value: this.formData.lastUpdatedDate },
      { label: 'Status', value: this.formData.status },
      { label: 'User ID', value: this.formData.userId }
    ];
  }

  formFields: FormField[] = [
    {
      key: 'displayName',
      label: 'Display Name',
      type: 'text'
    },
    {
      key: 'earnPrefix',
      label: 'Earn Prefix Display Indicator',
      type: 'select',
      options: [
        { value: 'N', label: 'N' },
        { value: 'Y', label: 'Y' }
      ]
    },
    {
      key: 'lob',
      label: 'LOB',
      type: 'select',
      options: [
        { value: 'Consumer', label: 'Consumer' },
        { value: 'Commercial', label: 'Commercial' }
      ]
    },
    {
      key: 'reportingGroup',
      label: 'Reporting Group',
      type: 'text'
    },
    {
      key: 'tierProfile',
      label: 'Tier Profile',
      type: 'modal-select',
      readonly: true,
      modalConfig: {
        title: 'Tier Profiles',
        columns: ['Tier Id', 'Name'],
        displayKeys: ['id', 'name'],
        data: this.tierProfiles
      }
    }
  ];

  onFieldChange(event: {key: string; value: any}) {
    this.formData[event.key] = event.value;
  }

  onModalOpen(field: FormField) {
    this.activeModal = field;
    this.showModal = true;
  }

  onModalSelect(row: any) {
    if (this.activeModal) {
      this.formData[this.activeModal.key] = row.name;
    }
    this.showModal = false;
    this.activeModal = null;
  }
}