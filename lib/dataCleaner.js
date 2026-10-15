import Papa from 'papaparse';

const FISCAL_MONTH_MAP = {
  '001': 'April',
  '002': 'May',
  '003': 'June',
  '004': 'July',
  '005': 'August',
  '006': 'September',
  '007': 'October',
  '008': 'November',
  '009': 'December',
  '010': 'January',
  '011': 'February',
  '012': 'March',
};

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTH_ORDER = MONTHS.reduce((acc, m, idx) => {
  acc[m] = idx + 1;
  return acc;
}, {});

export const QUARTER_MAP = {
  January: 'Q1', February: 'Q1', March: 'Q1',
  April: 'Q2', May: 'Q2', June: 'Q2',
  July: 'Q3', August: 'Q3', September: 'Q3',
  October: 'Q4', November: 'Q4', December: 'Q4'
};

export const KPI_KEYS = ['Total_Income', 'DOE', 'IOE', 'PBT', 'GOP'];

export const KPI_META = {
  Total_Income: {
    label: 'Total Income',
    short: 'Income',
    color: '#38bdf8', // Sky Blue
    bg: 'rgba(56, 189, 248, 0.1)',
    border: 'rgba(56, 189, 248, 0.3)',
    description: 'Gross operating revenue across maritime freight & charters'
  },
  DOE: {
    label: 'Direct Operating Expenses',
    short: 'DOE',
    color: '#f97316', // Orange
    bg: 'rgba(249, 115, 22, 0.1)',
    border: 'rgba(249, 115, 22, 0.3)',
    description: 'Fuel/bunkers, port dues, canal fees, crew wages & voyage costs'
  },
  IOE: {
    label: 'Indirect Operating Expenses',
    short: 'IOE',
    color: '#10b981', // Emerald
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.3)',
    description: 'Overheads, insurance, administrative & shore support allocations'
  },
  GOP: {
    label: 'Gross Operating Profit',
    short: 'GOP',
    color: '#a855f7', // Purple
    bg: 'rgba(168, 85, 247, 0.1)',
    border: 'rgba(168, 85, 247, 0.3)',
    description: 'Gross operational surplus prior to financing and overhead deductions'
  },
  PBT: {
    label: 'Profit Before Tax',
    short: 'PBT',
    color: '#ef4444', // Rose / Red
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.3)',
    description: 'Net profit before tax deductions, interest & asset depreciation'
  }
};

/**
 * Clean & Parse CSV raw text mimicking cleaner.py
 */
export function cleanCSVData(csvText) {
  // Parse raw rows first to check for double headers
  const parsed = Papa.parse(csvText, {
    skipEmptyLines: 'greedy',
    header: false,
  });

  const rawRows = parsed.data;
  if (!rawRows || rawRows.length < 2) {
    throw new Error('CSV file is empty or does not have enough rows.');
  }

  const row0 = rawRows[0] || [];
  const row1 = rawRows[1] || [];

  const countNamed = (row) => row.filter(c => c && typeof c === 'string' && c.trim() && !c.toLowerCase().startsWith('unnamed')).length;
  const isDoubleHeader = countNamed(row0) > 2 && countNamed(row1) > 2;

  let headers = [];
  let dataRows = [];

  if (isDoubleHeader) {
    const maxCols = Math.max(row0.length, row1.length);
    for (let i = 0; i < maxCols; i++) {
      const h0 = (row0[i] || '').trim();
      const h1 = (row1[i] || '').trim();
      const valid0 = h0 && !h0.toLowerCase().startsWith('unnamed');
      const valid1 = h1 && !h1.toLowerCase().startsWith('unnamed');

      if (valid0 && valid1) {
        headers.push(`${h0} ${h1}`);
      } else if (valid0) {
        headers.push(h0);
      } else if (valid1) {
        headers.push(h1);
      } else {
        headers.push(`col_${i}`);
      }
    }
    dataRows = rawRows.slice(2);
  } else {
    headers = row0.map((h, i) => (h && h.trim()) ? h.trim() : `col_${i}`);
    dataRows = rawRows.slice(1);
  }

  // Column mapping dictionary
  const columnMap = {
    'Sector Code': 'sector',
    'Sector': 'sector',
    'Vessel': 'vessel',
    'Vessel Name': 'vessel',
    'Vessel code': 'vessel_code',
    'vessel_code': 'vessel_code',
    'Total Income (In Lacs) Debit/Credit Amount': 'Total_Income',
    'Total Income': 'Total_Income',
    'Total_Income': 'Total_Income',
    'DOE (In Lacs) Debit/Credit Amount': 'DOE',
    'DOE': 'DOE',
    'IOE (In Lacs) Debit/Credit Amount': 'IOE',
    'IOE': 'IOE',
    'GOP (In Lacs) Debit/Credit Amount': 'GOP',
    'GOP': 'GOP',
    'Profit before Int. & Dep. (In Lacs) Debit/Credit Amount': 'PBT',
    'PBT': 'PBT',
    'financial_year': 'year',
    'year': 'year',
    'Year': 'year',
    'financial_month': 'month',
    'month': 'month',
    'Month': 'month'
  };

  const normalizedHeaders = headers.map(h => {
    const trimmed = h.trim();
    return columnMap[trimmed] || trimmed;
  });

  const cleanedRecords = [];

  for (const row of dataRows) {
    if (!row || row.length === 0) continue;
    const item = {};

    normalizedHeaders.forEach((colName, idx) => {
      item[colName] = row[idx];
    });

    // Check for Fiscal year/period
    if (item['Fiscal year/period']) {
      const fStr = String(item['Fiscal year/period']);
      const monthCodeMatch = fStr.match(/\/(\d{3})/);
      const yearMatch = fStr.match(/\.(\d{4})/);

      if (monthCodeMatch && FISCAL_MONTH_MAP[monthCodeMatch[1]]) {
        item['month'] = FISCAL_MONTH_MAP[monthCodeMatch[1]];
      }
      if (yearMatch) {
        item['year'] = parseInt(yearMatch[1], 10);
      }
    }

    // Clean Year
    if (item['year'] !== undefined && item['year'] !== null) {
      const yr = parseInt(String(item['year']).replace(/[^\d]/g, ''), 10);
      item['year'] = isNaN(yr) ? null : yr;
    }

    // Clean Month
    if (item['month']) {
      const rawMonth = String(item['month']).trim();
      const matched = MONTHS.find(m => m.toLowerCase() === rawMonth.toLowerCase());
      item['month'] = matched || rawMonth;
    }

    // Clean strings
    item['sector'] = item['sector'] ? String(item['sector']).trim() : '';
    item['vessel'] = item['vessel'] ? String(item['vessel']).trim() : '';
    item['vessel_code'] = item['vessel_code'] ? String(item['vessel_code']).trim() : '';

    // Validate critical fields
    if (!item['year'] || !item['sector'] || !item['vessel']) {
      continue;
    }

    // Clean numeric KPI columns
    KPI_KEYS.forEach(kpi => {
      let val = item[kpi];
      if (val === undefined || val === null || val === '') {
        item[kpi] = 0;
      } else {
        const cleanStr = String(val).replace(/,/g, '').replace(/[^\d.-]/g, '');
        const num = parseFloat(cleanStr);
        item[kpi] = isNaN(num) ? 0 : Math.round(num * 100) / 100;
      }
    });

    // Add derived helpers
    const monthIndex = MONTH_ORDER[item['month']] || 1;
    item['month_index'] = monthIndex;
    item['month_year'] = `${item['month']?.slice(0, 3)} ${item['year']}`;
    item['quarter'] = QUARTER_MAP[item['month']] || 'Q1';
    item['quarter_year'] = `${item['quarter']} ${item['year']}`;

    cleanedRecords.push(item);
  }

  return cleanedRecords;
}

/**
 * Format currency in Indian Lacs (₹ Lacs)
 */
export function formatLacs(val, invertAccounting = true) {
  if (val === undefined || val === null || isNaN(val)) return '₹0.00 Lacs';
  const displayVal = invertAccounting ? -1 * val : val;
  const isNegative = displayVal < 0;
  const absVal = Math.abs(displayVal);
  const formatted = absVal.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `${isNegative ? '-' : ''}₹${formatted} Lacs`;
}

/**
 * Format raw number with commas and sign
 */
export function formatNumber(val, invertAccounting = true) {
  if (val === undefined || val === null || isNaN(val)) return '0.00';
  const displayVal = invertAccounting ? -1 * val : val;
  return displayVal.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
