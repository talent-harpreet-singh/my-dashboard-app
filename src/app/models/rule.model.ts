export interface RuleDetails {
  lastUpdatedDate: string;
  status: string;
  userId: string;
  displayName: string;
  earnPrefix: string;
  lob: string;
  tierGroup: string;
  merchantEligibility: string;
  expenseCode: string;
  bonusType: string;
  tierProfile: string;
  reportingGroup: string;
  statementReportLineNo: number;
}

export interface Program {
  programNumber: string;
  legacyCode: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  userId: string;
  lastUpdated: string;
  delete: boolean;
}

export interface Note {
  seqNo: number;
  note: string;
  userId: string;
  lastUpdated: string;
}