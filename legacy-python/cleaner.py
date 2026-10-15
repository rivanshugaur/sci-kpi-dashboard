import pandas as pd
import re
import io
import logging
from typing import Union, Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_cleaned_data(file: Union[str, io.BytesIO]) -> pd.DataFrame:
    encoding = 'ISO-8859-1'

    file_obj = None
    if isinstance(file, str):
        file_obj = file
    else:
        try:
            file_content = file.read()
            file_obj = io.BytesIO(file_content)
        except Exception as e:
            logger.error(f"Error reading file: {e}")
            raise

    try:
        header_preview = pd.read_csv(file_obj, encoding=encoding, nrows=3, header=None)
        if hasattr(file_obj, 'seek'):
            file_obj.seek(0)
    except Exception as e:
        logger.error(f"Error reading CSV preview: {e}")
        raise
    
    row0 = header_preview.iloc[0]
    row1 = header_preview.iloc[1]

    row0_named = sum(~row0.isna() & ~row0.astype(str).str.lower().str.startswith('unnamed'))
    row1_named = sum(~row1.isna() & ~row1.astype(str).str.lower().str.startswith('unnamed'))

    use_double_header = (row0_named > 2) and (row1_named > 2)
    logger.info(f"Using double header: {use_double_header}")

    if use_double_header:
        combined_headers = []
        for a, b in zip(row0, row1):
            if pd.notna(a) and not str(a).startswith("Unnamed"):
                if pd.notna(b) and not str(b).startswith("Unnamed"):
                    combined = f"{str(a).strip()} {str(b).strip()}"
                else:
                    combined = str(a).strip()
            else:
                combined = str(b).strip() if pd.notna(b) else ""
            combined_headers.append(combined)

        df = pd.read_csv(file_obj, encoding=encoding, skiprows=2, header=None)
        df.columns = combined_headers
    else:
        df = pd.read_csv(file_obj, encoding=encoding)

    df.rename(columns={"Vessel code": "vessel_code"}, inplace=True)

    column_mapping = {
        "Sector Code": "sector",
        "Vessel": "vessel",
        "Total Income (In Lacs) Debit/Credit Amount": "Total_Income",
        "DOE (In Lacs) Debit/Credit Amount": "DOE",
        "IOE (In Lacs) Debit/Credit Amount": "IOE",
        "GOP (In Lacs) Debit/Credit Amount": "GOP",
        "Profit before Int. & Dep. (In Lacs) Debit/Credit Amount": "PBT",
        "financial_year": "year",
        "financial_month": "month"
    }
    
    df.rename(columns=column_mapping, inplace=True)
    df = df.loc[:, df.columns.str.strip() != '']

    fin_month_map = {
        '001': 'April', '002': 'May', '003': 'June', '004': 'July',
        '005': 'August', '006': 'September', '007': 'October',
        '008': 'November', '009': 'December', '010': 'January',
        '011': 'February', '012': 'March',
    }

    if 'Fiscal year/period' in df.columns:
        df['fiscal_month_code'] = df['Fiscal year/period'].astype(str).str.extract(r'/(\d{3})')
        df['financial_year'] = df['Fiscal year/period'].astype(str).str.extract(r'\.(\d{4})')
        df['financial_month'] = df['fiscal_month_code'].map(fin_month_map)

        df['financial_month'] = df['financial_month'].fillna('Unknown')
        df['financial_year'] = df['financial_year'].fillna('Unknown')
        df.drop(columns=['fiscal_month_code'], inplace=True)

        valid_data = (df['financial_year'] != 'Unknown') & (df['financial_month'] != 'Unknown')
        df = df[valid_data]
        df['financial_year'] = df['financial_year'].astype(int)
        df.rename(columns={'financial_year': 'year', 'financial_month': 'month'}, inplace=True)

    for col in ['sector', 'vessel']:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip().replace('nan', '')
            df[col] = df[col].replace('', pd.NA)

    kpi_cols = ["Total_Income", "DOE", "IOE", "PBT", "GOP"]
    for col in kpi_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).str.replace(',', '')
            df[col] = df[col].str.replace(r'[^\d.-]', '', regex=True)
            df[col] = pd.to_numeric(df[col], errors='coerce')
            df[col] = df[col].fillna(0).round(2)

    cols_to_drop = [
        "Segment", "Voyage Number", "Fiscal year/period",
        "Depreciation (In Lacs) Debit/Credit Amount",
        "Profit After Depreciation (In Lacs) Debit/Credit Amount",
        "Finance Cost (In Lacs) Debit/Credit Amount",
        "Exchange Gain/Loss (In Lacs) Debit/Credit Amount"
    ]
    
    for col in cols_to_drop:
        if col in df.columns:
            df.drop(columns=col, inplace=True)

    required_columns = ['year', 'sector', 'vessel']
    existing_required = [col for col in required_columns if col in df.columns]
    if existing_required:
        df = df.dropna(subset=existing_required)

    return df
