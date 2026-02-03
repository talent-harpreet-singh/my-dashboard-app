import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { RuleDetails, Program, Note } from '../../models/rule.model';
import { DynamicFormComponent } from '../common/dynamic-form/dynamic-form.component';
import { ProgramsTableComponent } from '../programs-table/programs-table.component';
import { NotesSectionComponent } from '../notes-section/notes-section.component';
import { RuleDetailsComponent } from '../rule-details/rule-details.component';
import { TierProfileModalComponent } from '../tier-profile-modal/tier-profile-modal.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormField } from '../../models/form-model';

const LOCAL_STORAGE_KEY = 'ruleEditorData';

@Component({
  selector: 'app-rule-editor',
  templateUrl: './rule-editor.component.html',
  imports: [DynamicFormComponent, ProgramsTableComponent, NotesSectionComponent, RuleDetailsComponent, TierProfileModalComponent, CommonModule, MatButtonModule, MatIconModule],
  standalone: true
})
export class RuleEditorComponent implements OnInit {
  ruleDetails!: RuleDetails;
  programs!: Program[];
  notes!: Note[];
  showDelete: boolean = true;
  showModal = false;
  activeModal: FormField | null = null;

  // Form fields for the dynamic form
  ruleFormFields: FormField[] = [
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
      key: 'tierGroup',
      label: 'Tier Group',
      type: 'text'
    },
    {
      key: 'merchantEligibility',
      label: 'Merchant Eligibility',
      type: 'text'
    },
    {
      key: 'expenseCode',
      label: 'Expense Code',
      type: 'text'
    },
    {
      key: 'bonusType',
      label: 'Bonus Type',
      type: 'select',
      options: [
        { value: 'Fixed', label: 'Fixed' },
        { value: 'Percentage', label: 'Percentage' },
        { value: 'Tiered', label: 'Tiered' }
      ]
    },
    {
      key: 'tierProfile',
      label: 'Tier Profile',
      type: 'modal-select',
      modalConfig: {
        title: 'Select Tier Profile',
        columns: ['ID', 'Name', 'Description'],
        displayKeys: ['id', 'name', 'description'],
        data: [
          { id: 182, name: '8.5 PERCENT (182)', description: '8.5% tier profile' },
          { id: 183, name: '5.5 PERCENT (183)', description: '5.5% tier profile' },
          { id: 184, name: '9.5 PERCENT (184)', description: '9.5% tier profile' },
          { id: 186, name: '0% PROFILE (186)', description: '0% tier profile' },
          { id: 198, name: '400% NO BAL (198)', description: '400% no balance profile' }
        ]
      }
    },
    {
      key: 'reportingGroup',
      label: 'Reporting Group',
      type: 'text',
      readonly: true
    },
    {
      key: 'statementReportLineNo',
      label: 'Statement Report Line No',
      type: 'number'
    }
  ];

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if data was passed via route state (from PR Bonus Rules table)
    const navigation = this.router.getCurrentNavigation();
    const rowData = navigation?.extras?.state;

    if (rowData && rowData['promoId']) {
      // Pre-fill form with data from clicked row
      this.initializeWithRowData(rowData);
    } else {
      // Check query params to see if it's a new rule
      const route = this.route.snapshot;
      const isNewRule = route.queryParams['new'] === 'true';
      
      if (isNewRule) {
        // Initialize with empty data for new rule
        this.initializeEmptyRule();
      } else {
        // Load from localStorage or use default data
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
    }
    
    // Set default value for readonly reportingGroup field
    if (!this.ruleDetails.reportingGroup) {
      this.ruleDetails.reportingGroup = '6';
    }
  }

  private initializeEmptyRule(): void {
    // Initialize with empty/default values (no Last Updated, Status, User ID)
    this.ruleDetails = {
      lastUpdatedDate: '',
      status: '',
      userId: '',
      displayName: '',
      earnPrefix: '',
      lob: '',
      tierGroup: '',
      merchantEligibility: '',
      expenseCode: '',
      bonusType: '',
      tierProfile: '',
      reportingGroup: '6',
      statementReportLineNo: 0
    };

    // Initialize with empty arrays
    this.programs = [];
    this.notes = [];
  }

  private initializeWithRowData(rowData: any): void {
    const defaultRuleDetails = this.dataService.getRuleDetails();
    
    this.ruleDetails = {
      ...defaultRuleDetails,
      displayName: rowData.displayName || '',
      lastUpdatedDate: rowData.lastUpdateDate || '',
      status: rowData.status || '',
      userId: rowData.userId || '',
      // Convert LOB from number to string (1 = Consumer, other = Commercial)
      lob: rowData.lob === 1 ? 'Consumer' : (rowData.lob ? 'Commercial' : ''),
      // Other fields remain empty/default
      earnPrefix: '',
      tierGroup: '',
      merchantEligibility: '',
      expenseCode: '',
      bonusType: '',
      tierProfile: '',
      reportingGroup: '6',
      statementReportLineNo: 0
    };

    this.programs = this.dataService.getPrograms();
    this.notes = this.dataService.getNotes();
  }

  onFieldChange(event: { key: string; value: any }) {
    this.ruleDetails[event.key] = event.value;
  }

  onModalOpen(field: FormField) {
    this.activeModal = field;
    this.showModal = true;
  }

  onModalSelect(row: any) {
    if (this.activeModal) {
      this.ruleDetails[this.activeModal.key] = row.name;
    }
    this.showModal = false;
    this.activeModal = null;
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
