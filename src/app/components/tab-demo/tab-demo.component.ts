import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TabInterfaceComponent, TabData } from '../tab-interface/tab-interface.component';
import { NotesSectionComponent } from '../notes-section/notes-section.component';
import { ProgramsTableComponent } from '../programs-table/programs-table.component';
import { Program } from '../../models/rule.model';
import { FormField } from '../../models/form-model';
import { FormInputsComponent } from '../form-inputs/form-inputs.component';

@Component({
  selector: 'app-tab-demo',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, TabInterfaceComponent],
  templateUrl: './tab-demo.component.html',
  styleUrls: ['../../styles/tab-demo.component.scss']
})
export class TabDemoComponent implements OnInit {

  // Sample notes data
  sampleNotes = [
    {
      seqNo: 1,
      note: 'This is a sample note for demonstration purposes.',
      userId: 'ZKYSZI6',
      lastUpdated: '2024-12-15 10:30:00'
    },
    {
      seqNo: 2,
      note: 'Another note showing the notes section component integration.',
      userId: 'ZKYSZI6',
      lastUpdated: '2024-12-15 11:45:00'
    }
  ];

  programs: Program[] = [
    {
      programNumber: '10690905',
      legacyCode: 'AF-01',
      description: 'Air France KLM World Elite Mastercard',
      startDate: '01-01-0001',
      endDate: '12-31-9999',
      status: 'P*',
      userId: 'ZKYSZI6',
      lastUpdated: '04-21-2025 02:13:00 PM',
      delete: false
    },
    {
      programNumber: '106906315',
      legacyCode: 'AF-03',
      description: 'Air France KLM World Elite Mastercard',
      startDate: '01-01-0001',
      endDate: '12-31-9999',
      status: 'P*',
      userId: 'ZKYSZI6',
      lastUpdated: '04-21-2025 02:13:00 PM',
      delete: false
    },
    {
      programNumber: '106906315dtydr',
      legacyCode: 'AF-04',
      description: 'Air France KLM World Elite Mastercard',
      startDate: '01-01-0001',
      endDate: '12-31-9999',
      status: 'P*',
      userId: 'ZKYSZI6',
      lastUpdated: '04-21-2025 02:13:00 PM',
      delete: false
    },
    {
      programNumber: '10690631789',
      legacyCode: 'AF-05',
      description: 'Air France KLM World Elite Mastercard',
      startDate: '01-01-0001',
      endDate: '12-31-9999',
      status: 'P*',
      userId: 'ZKYSZI6',
      lastUpdated: '04-21-2025 02:13:00 PM',
      delete: false
    },
  ];

  formData: { [key: string]: any } = {};
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
  ];

  basicTabs: TabData[] = [
    {
      id: 'credits',
      label: 'Credits',
      icon: 'credit_card',
      content: '',
      componentType: ProgramsTableComponent,
      componentData: {
        programs: this.programs
      }
    },
    {
      id: 'rewards',
      label: 'Rewards Summary',
      icon: 'stars',
      content: '',
      componentType: FormInputsComponent,
      componentData: {
        formData: this.formFields
      }
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: 'note',
      content: '',
      componentType: NotesSectionComponent,
      componentData: {
        notes: this.sampleNotes,
        showDelete: true
      }
    }
  ];


  activeTabId: string = 'credits';
  activeClosableTabId: string = 'tab1';
  activeModal: FormField | null = null;
  showModal: boolean = false;

  constructor() {}

  ngOnInit() {}

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

  onTabChange(tabId: string) {
    console.log('Tab changed to:', tabId);
    this.activeTabId = tabId;
  }

  onClosableTabChange(tabId: string) {
    console.log('Closable tab changed to:', tabId);
    this.activeClosableTabId = tabId;
  }

  onNoteAdded() {
    console.log('Note added!');
  }
}
