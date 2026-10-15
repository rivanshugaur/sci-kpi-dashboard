# sci_dashboard.py
"""
SCI KPI Dashboard Module (Streamlit Legacy)
"""

import streamlit as st
import pandas as pd
import plotly.express as px
from cleaner import load_cleaned_data
from sqlalchemy import create_engine
from urllib.parse import quote_plus
import os
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", "Stcs@9978"),
    "host": os.getenv("DB_HOST", "localhost"),
    "port": os.getenv("DB_PORT", "3306"),
    "name": os.getenv("DB_NAME", "sci_db")
}

KPI_COLS = ["Total_Income", "DOE", "IOE", "PBT", "GOP"]
KPI_COLORS = {
    "Total_Income": "#1f77b4",
    "DOE": "#ff7f0e",
    "IOE": "#2ca02c",
    "PBT": "#d62728",
    "GOP": "#9467bd"
}

MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]
MONTH_ORDER = {month: idx for idx, month in enumerate(MONTHS, start=1)}

QUARTER_MAP = {
    "January": "Q1", "February": "Q1", "March": "Q1",
    "April": "Q2", "May": "Q2", "June": "Q2",
    "July": "Q3", "August": "Q3", "September": "Q3",
    "October": "Q4", "November": "Q4", "December": "Q4"
}

def sci_kpi_dashboard():
    st.write("Legacy Streamlit dashboard loaded.")
