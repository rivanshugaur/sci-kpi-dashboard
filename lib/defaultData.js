import { MONTHS, MONTH_ORDER, QUARTER_MAP } from './dataCleaner';

const SECTORS_AND_VESSELS = [
  {
    sector: 'Crude Tanker',
    vessels: [
      { name: 'MT Desh Shanti', code: 'TK-101' },
      { name: 'MT Desh Bhakt', code: 'TK-102' },
      { name: 'MT Desh Samman', code: 'TK-103' }
    ]
  },
  {
    sector: 'Product Tanker',
    vessels: [
      { name: 'MT Swarna Pushp', code: 'PT-201' },
      { name: 'MT Swarna Mala', code: 'PT-202' },
      { name: 'MT Swarna Kalash', code: 'PT-203' }
    ]
  },
  {
    sector: 'Bulk Carrier',
    vessels: [
      { name: 'MV Vishva Nidhi', code: 'BC-301' },
      { name: 'MV Vishva Prerna', code: 'BC-302' },
      { name: 'MV Vishva Jyoti', code: 'BC-303' }
    ]
  },
  {
    sector: 'Offshore Supply',
    vessels: [
      { name: 'SCI Urja', code: 'OS-401' },
      { name: 'SCI Ahimsa', code: 'OS-402' }
    ]
  },
  {
    sector: 'Liner & Container',
    vessels: [
      { name: 'SCI Yamuna', code: 'LN-501' },
      { name: 'SCI Ganga', code: 'LN-502' }
    ]
  }
];

function generateSeedData() {
  const records = [];
  const years = [2022, 2023, 2024, 2025];

  years.forEach((yr, yIdx) => {
    // Growth multiplier per year
    const growth = 1 + (yIdx * 0.12);

    SECTORS_AND_VESSELS.forEach((secObj) => {
      secObj.vessels.forEach((vesObj, vIdx) => {
        // Base profile per vessel type
        const isTanker = secObj.sector.includes('Tanker');
        const isBulk = secObj.sector.includes('Bulk');
        const baseIncome = isTanker ? 2800 : (isBulk ? 1900 : 1400);

        MONTHS.forEach((month, mIdx) => {
          // Seasonality factor (monsoon Q2 slight dip, winter Q3/Q4 peak charter rates)
          const season = (mIdx >= 5 && mIdx <= 7) ? 0.88 : (mIdx >= 9 || mIdx <= 2 ? 1.15 : 1.0);
          const variation = (Math.sin(mIdx * 1.5 + vIdx) * 0.15) + 1;

          // Note: In SAP accounting export (as seen in cleaner.py & sci_dashboard.py),
          // values are stored with negative sign convention
          const income = Math.round((baseIncome * growth * season * variation) * 100) / 100;
          const doe = Math.round((income * 0.62 + (Math.cos(mIdx) * 50)) * 100) / 100;
          const ioe = Math.round((income * 0.11 + 30) * 100) / 100;
          const gop = Math.round((income - doe) * 100) / 100;
          const pbt = Math.round((gop - ioe - 45) * 100) / 100;

          const monthIndex = MONTH_ORDER[month];
          const quarter = QUARTER_MAP[month];

          records.push({
            year: yr,
            month: month,
            month_index: monthIndex,
            month_year: `${month.slice(0, 3)} ${yr}`,
            quarter: quarter,
            quarter_year: `${quarter} ${yr}`,
            sector: secObj.sector,
            vessel: vesObj.name,
            vessel_code: vesObj.code,
            // SAP export negative convention
            Total_Income: -1 * income,
            DOE: -1 * doe,
            IOE: -1 * ioe,
            GOP: -1 * gop,
            PBT: -1 * pbt
          });
        });
      });
    });
  });

  return records;
}

export const DEFAULT_KPI_DATA = generateSeedData();
