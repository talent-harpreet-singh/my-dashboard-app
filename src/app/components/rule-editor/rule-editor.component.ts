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
import {
  exportDetailPageToExcel,
  DetailPageExcelExportConfig
} from '../../utils/excel-export.util';

const LOCAL_STORAGE_KEY = 'ruleEditorData';

interface RuleEditorNavState {
  promoId?: string | number;
  displayName?: string;
  lastUpdateDate?: string;
  status?: string;
  userId?: string;
  lob?: number | string;
}

@Component({
  selector: 'app-rule-editor',
  templateUrl: './rule-editor.component.html',
  imports: [DynamicFormComponent, ProgramsTableComponent, NotesSectionComponent, RuleDetailsComponent, TierProfileModalComponent, CommonModule, MatButtonModule, MatIconModule],
  standalone: true
})
export class RuleEditorComponent implements OnInit {
  ruleId: string = '';
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
    const rowData = navigation?.extras?.state as RuleEditorNavState | undefined;

    if (rowData && rowData.promoId) {
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
        this.ruleId = '';
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
    this.ruleId = '';
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

  private initializeWithRowData(rowData: RuleEditorNavState): void {
    this.ruleId = String(rowData.promoId ?? '');
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

  exportToExcel(): void {
    const title = this.ruleId
      ? `PR / RR Bonus Rule ${this.ruleId} Details`
      : 'PR / RR Bonus Rule Details';

    const fileName = this.ruleId
      ? `PR_RR_Bonus_Rule_${this.ruleId}_Details.xlsx`
      : 'PR_RR_Bonus_Rule_Details.xlsx';

    const config: DetailPageExcelExportConfig = {
      fileName,
      sheetName: 'Details',
      title,
      meta: [
        { label: 'Last Updated Date', value: this.ruleDetails?.lastUpdatedDate },
        { label: 'Status', value: this.ruleDetails?.status },
        { label: 'User Id', value: this.ruleDetails?.userId }
      ],
      fields: this.ruleFormFields.map((f) => ({
        label: f.label,
        value: this.ruleDetails?.[f.key]
      })),
      sections: [
        {
          type: 'table-data',
          title: 'Notes',
          columns: [
            { key: 'seqNo', header: 'Note Seq No' },
            { key: 'note', header: 'Notes' },
            { key: 'userId', header: 'User ID' },
            { key: 'lastUpdated', header: 'Last Updated Date' }
          ],
          rows: (this.notes || []).map((n) => ({
            seqNo: n.seqNo,
            note: n.note,
            userId: n.userId,
            lastUpdated: n.lastUpdated
          }))
        },
        {
          type: 'table-data',
          title: 'Programs attached to this promo',
          columns: [
            { key: 'programNumber', header: 'Program Number' },
            { key: 'legacyCode', header: 'Legacy Code' },
            { key: 'description', header: 'Description' },
            { key: 'startDate', header: 'Start Dt' },
            { key: 'endDate', header: 'End Dt' },
            { key: 'status', header: 'Status' },
            { key: 'userId', header: 'User Id' },
            { key: 'lastUpdated', header: 'Last Updated Date' }
          ],
          rows: (this.programs || []).map((p) => ({
            programNumber: p.programNumber,
            legacyCode: p.legacyCode,
            description: p.description,
            startDate: p.startDate,
            endDate: p.endDate,
            status: p.status,
            userId: p.userId,
            lastUpdated: p.lastUpdated
          }))
        }
      ]
    };

    const result = exportDetailPageToExcel(config);
    if (!result.success) {
      alert(result.error || 'Export failed');
    }
  }
}
