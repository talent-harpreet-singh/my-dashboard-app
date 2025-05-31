import { Injectable } from '@angular/core';
import { RuleDetails, Program, Note } from '../models/rule.model';

@Injectable({ providedIn: 'root' })
export class DataService {
  getRuleDetails(): RuleDetails {
    return {
      lastUpdatedDate: '04-21-2025 02:13:00 PM',
      status: 'P',
      userId: 'ZKYSZI6',
      displayName: 'RELATIONSHIP BONUS: Preferred Rewards - 50% Bonus',
      earnPrefix: 'N',
      lob: 'Consumer',
      tierGroup: '2 | PLATINUM',
      merchantEligibility: 'E',
      expenseCode: 'EC07000032',
      bonusType: 'P | PREFERRED REWARDS',
      tierProfile: 'STD 50% with Neg End Pt (627)',
      reportingGroup: 'PR CASH',
      statementReportLineNo: 6
    };
  }

  getPrograms(): Program[] {
    return [
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
      // More with same structure
    ];
  }

  getNotes(): Note[] {
    return [
      { seqNo: 1, note: 'PAS 732242 Modify Display Text', userId: 'NBKL6AO', lastUpdated: '11-04-2021 08:20:24 AM' },
      { seqNo: 2, note: 'checking stage entry', userId: 'ZK1GGVO', lastUpdated: '09-23-2024 11:03:47 AM' },
      { seqNo: 3, note: 'stage', userId: 'ZKYSZI6', lastUpdated: '04-17-2025 01:17:53 PM' },
      { seqNo: 4, note: 'entry', userId: 'ZKYSZI6', lastUpdated: '04-17-2025 03:03:01 PM' },
      { seqNo: 5, note: 'test', userId: 'ZKYSZI6', lastUpdated: '04-17-2025 03:04:50 PM' },
      { seqNo: 6, note: 'two data', userId: 'ZKYSZI6', lastUpdated: '04-17-2025 09:53:28 PM' },
      { seqNo: 7, note: 'second test', userId: 'ZKYSZI6', lastUpdated: '04-17-2025 09:54:13 PM' },
      { seqNo: 8, note: 'data', userId: 'ZKYSZI6', lastUpdated: '04-18-2025 09:43:42 AM' },
      { seqNo: 9, note: 'third', userId: 'ZKYSZI6', lastUpdated: '04-21-2025 02:13:00 PM' }
    ];
  }
}