import {
  appendDetailPageSections,
  buildDetailPageAoA,
  buildDetailPageHeaderAoA,
  DetailPageExcelExportConfig,
  cellValueToPlainText,
  readHtmlTableToAoA,
  exportDetailPageToExcel
} from './excel-export.util';

describe('cellValueToPlainText', () => {
  it('keeps sentinel date strings unchanged', () => {
    expect(cellValueToPlainText('01-01-0001')).toBe('01-01-0001');
    expect(cellValueToPlainText('12-31-9999')).toBe('12-31-9999');
  });

  it('maps null/undefined to empty string', () => {
    expect(cellValueToPlainText(null)).toBe('');
    expect(cellValueToPlainText(undefined)).toBe('');
  });

  it('stringifies numbers', () => {
    expect(cellValueToPlainText(6)).toBe('6');
  });
});

describe('buildDetailPageAoA', () => {
  const base: DetailPageExcelExportConfig = {
    fileName: 'test.xlsx',
    title: 'PR / RR Bonus Rule Details',
    meta: [
      { label: 'Last Updated Date', value: '04-21-2025 02:13:00 PM' },
      { label: 'Status', value: 'P' },
      { label: 'User Id', value: 'ZKYSZI6' }
    ],
    fields: [
      { label: 'Display Name', value: 'Test Bonus' },
      { label: 'LOB', value: 'Consumer' }
    ],
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
        rows: [
          { seqNo: 1, note: 'hello', userId: 'U1', lastUpdated: '11-04-2021 08:20:24 AM' }
        ]
      },
      {
        type: 'table-data',
        title: 'Programs attached to this promo',
        columns: [
          { key: 'programNumber', header: 'Program Number' },
          { key: 'startDate', header: 'Start Dt' },
          { key: 'endDate', header: 'End Dt' }
        ],
        rows: [
          {
            programNumber: '10069325',
            startDate: '01-01-0001',
            endDate: '12-31-9999'
          }
        ]
      }
    ]
  };

  it('starts with title then blank row', () => {
    const aoa = buildDetailPageAoA(base);
    expect(aoa[0][0]).toBe('PR / RR Bonus Rule Details');
    expect(aoa[1].every((c) => c === '')).toBe(true);
  });

  it('places meta label/value pairs on one row', () => {
    const aoa = buildDetailPageAoA(base);
    const metaRow = aoa[2];
    expect(metaRow[0]).toBe('Last Updated Date');
    expect(metaRow[1]).toBe('04-21-2025 02:13:00 PM');
    expect(metaRow[2]).toBe('Status');
    expect(metaRow[3]).toBe('P');
    expect(metaRow[4]).toBe('User Id');
    expect(metaRow[5]).toBe('ZKYSZI6');
  });

  it('includes form fields as label|value rows', () => {
    const aoa = buildDetailPageAoA(base);
    const display = aoa.find((r) => r[0] === 'Display Name');
    expect(display?.[1]).toBe('Test Bonus');
  });

  it('includes Notes and Programs section titles, headers, and text dates', () => {
    const aoa = buildDetailPageAoA(base);
    expect(aoa.some((r) => r[0] === 'Notes')).toBe(true);
    expect(aoa.some((r) => r[0] === 'Note Seq No')).toBe(true);
    expect(aoa.some((r) => r[0] === 'Programs attached to this promo')).toBe(true);
    const prog = aoa.find((r) => r[0] === '10069325');
    expect(prog?.[1]).toBe('01-01-0001');
    expect(prog?.[2]).toBe('12-31-9999');
  });

  it('omits meta row when all meta values empty', () => {
    const aoa = buildDetailPageAoA({
      ...base,
      meta: [
        { label: 'Status', value: '' },
        { label: 'User Id', value: null }
      ]
    });
    expect(aoa[0][0]).toBe('PR / RR Bonus Rule Details');
    expect(aoa[1].every((c) => c === '')).toBe(true);
    expect(aoa[2][0]).toBe('Display Name');
  });
});

describe('buildDetailPageHeaderAoA', () => {
  it('includes title/meta/fields but no table sections', () => {
    const config: DetailPageExcelExportConfig = {
      fileName: 'test.xlsx',
      title: 'Header Only',
      meta: [{ label: 'Status', value: 'P' }],
      fields: [{ label: 'Name', value: 'Test' }],
      sections: [
        {
          type: 'table-data',
          title: 'Notes',
          columns: [{ key: 'note', header: 'Notes' }],
          rows: [{ note: 'hello' }]
        }
      ]
    };
    const aoa = buildDetailPageHeaderAoA(config);
    expect(aoa[0][0]).toBe('Header Only');
    expect(aoa.some((r) => r[0] === 'Notes')).toBe(false);
    expect(aoa.some((r) => r[0] === 'Name')).toBe(true);
  });
});

describe('appendDetailPageSections', () => {
  const notesSection = {
    type: 'table-data' as const,
    title: 'Notes',
    columns: [{ key: 'note', header: 'Notes' }],
    rows: [{ note: 'data-note' }]
  };
  const programsSection = {
    type: 'table-data' as const,
    title: 'Programs',
    columns: [{ key: 'programNumber', header: 'Program Number' }],
    rows: [{ programNumber: '10069325' }]
  };

  it('preserves table-data section order', () => {
    const aoa = buildDetailPageHeaderAoA({
      fileName: 'test.xlsx',
      title: 'Mixed Order'
    });
    appendDetailPageSections(aoa, [notesSection, programsSection]);
    const notesIdx = aoa.findIndex((r) => r[0] === 'Notes');
    const programsIdx = aoa.findIndex((r) => r[0] === 'Programs');
    expect(notesIdx).toBeGreaterThan(-1);
    expect(programsIdx).toBeGreaterThan(notesIdx);
  });

  it('preserves mixed table-data and table-dom order', () => {
    const aoa = buildDetailPageHeaderAoA({
      fileName: 'test.xlsx',
      title: 'Mixed Order'
    });
    const readDom = jasmine
      .createSpy('readDom')
      .and.returnValue({ ok: true, rows: [['Dom Header'], ['dom-value']] });

    appendDetailPageSections(
      aoa,
      [
        notesSection,
        {
          type: 'table-dom',
          title: 'Dom Section',
          tableId: 'dom-table'
        },
        programsSection
      ],
      readDom
    );

    const notesIdx = aoa.findIndex((r) => r[0] === 'Notes');
    const domIdx = aoa.findIndex((r) => r[0] === 'Dom Section');
    const programsIdx = aoa.findIndex((r) => r[0] === 'Programs');
    const domValueIdx = aoa.findIndex((r) => r[0] === 'dom-value');

    expect(notesIdx).toBeGreaterThan(-1);
    expect(domIdx).toBeGreaterThan(notesIdx);
    expect(programsIdx).toBeGreaterThan(domIdx);
    expect(domValueIdx).toBeGreaterThan(domIdx);
    expect(readDom).toHaveBeenCalledWith('dom-table', []);
  });

  it('returns error when table-dom read fails', () => {
    const aoa = buildDetailPageHeaderAoA({
      fileName: 'test.xlsx',
      title: 'Mixed Order'
    });
    const result = appendDetailPageSections(
      aoa,
      [{ type: 'table-dom', title: 'Missing', tableId: 'missing' }],
      () => ({ ok: false, error: 'Table not found' })
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Table not found');
    }
  });
});

describe('getDomCellPlainText / readHtmlTableToAoA', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('reads input values and strips buttons', () => {
    document.body.innerHTML = `
      <table id="notes-export-table">
        <tr><th>Notes</th><th>User</th></tr>
        <tr>
          <td><input value="hello note" /></td>
          <td>U1 <button>Delete</button></td>
        </tr>
      </table>`;
    const read = readHtmlTableToAoA('notes-export-table');
    expect(read.ok).toBe(true);
    if (read.ok) {
      expect(read.rows[1][0]).toBe('hello note');
      expect(read.rows[1][1]).toBe('U1');
    }
  });

  it('returns error when table missing', () => {
    const read = readHtmlTableToAoA('missing-id');
    expect(read.ok).toBe(false);
  });
});

describe('exportDetailPageToExcel', () => {
  it('returns error when fileName empty', () => {
    const result = exportDetailPageToExcel({
      fileName: '',
      title: 'Test Title'
    });
    expect(result.success).toBe(false);
    expect(result.error).toBe('fileName is required');
  });

  it('returns error when title empty', () => {
    const result = exportDetailPageToExcel({
      fileName: 'test.xlsx',
      title: ''
    });
    expect(result.success).toBe(false);
    expect(result.error).toBe('title is required');
  });
});
