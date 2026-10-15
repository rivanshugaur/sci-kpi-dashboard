'use client';

import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';
import { cleanCSVData, formatNumber, KPI_KEYS } from '../lib/dataCleaner';

export default function UploadModal({ isOpen, onClose, onDataUploaded }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [parsedRows, setParsedRows] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadMode, setUploadMode] = useState('append'); // 'append' | 'replace'
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) processFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (f) => {
    if (!f.name.endsWith('.csv')) {
      setErrorMsg('Please upload a valid .csv file.');
      return;
    }
    setFile(f);
    setErrorMsg('');
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const cleaned = cleanCSVData(text);
        if (cleaned.length === 0) {
          setErrorMsg('No valid rows found in CSV. Ensure Sector, Vessel, Year, and KPI columns are present.');
          setParsedRows([]);
        } else {
          setParsedRows(cleaned);
        }
      } catch (err) {
        setErrorMsg(`Failed to parse CSV: ${err.message}`);
        setParsedRows([]);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read file from disk.');
      setIsProcessing(false);
    };
    reader.readAsText(f);
  };

  const handleCommit = () => {
    if (parsedRows.length > 0) {
      onDataUploaded(parsedRows, uploadMode);
      onClose();
    }
  };

  const handleDownloadSample = () => {
    const sampleCSV = `Sector Code,Vessel,Fiscal year/period,Total Income (In Lacs) Debit/Credit Amount,DOE (In Lacs) Debit/Credit Amount,IOE (In Lacs) Debit/Credit Amount,GOP (In Lacs) Debit/Credit Amount,Profit before Int. & Dep. (In Lacs) Debit/Credit Amount
Crude Tanker,MT Desh Shanti,001.2025,-3240.50,-1980.20,-310.40,-1260.30,-904.90
Crude Tanker,MT Desh Bhakt,001.2025,-2980.00,-1820.00,-280.00,-1160.00,-835.00
Product Tanker,MT Swarna Pushp,001.2025,-2150.80,-1320.40,-210.10,-830.40,-575.30
Bulk Carrier,MV Vishva Nidhi,001.2025,-1840.00,-1120.00,-180.00,-720.00,-495.00
Offshore Supply,SCI Urja,001.2025,-1420.00,-880.00,-140.00,-540.00,-355.00
Liner & Container,SCI Yamuna,001.2025,-1650.00,-1010.00,-165.00,-640.00,-430.00`;

    const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sci_kpi_sample_upload.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
      <div className="glass-card w-full max-w-2xl rounded-2xl p-6 border border-navy-700 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Upload Fleet KPI CSV</h3>
            <p className="text-xs text-slate-400">
              Clean and integrate weekly or monthly voyage reports directly into the dashboard.
            </p>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-sky-400 bg-sky-500/10'
              : 'border-navy-700 bg-navy-900/60 hover:border-slate-500'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <FileSpreadsheet className="w-10 h-10 text-sky-400" />
            <p className="text-sm font-semibold text-white">
              {file ? file.name : 'Click to browse or drop your CSV file here'}
            </p>
            <p className="text-xs text-slate-400 max-w-sm">
              Supports standard SAP exports, double-header sheets, and multi-vessel ledger files.
            </p>
          </div>
        </div>

        {/* Sample Template & Help */}
        <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
          <span>Need the expected format?</span>
          <button
            onClick={handleDownloadSample}
            type="button"
            className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            Download Sample CSV Template
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Parsed Preview */}
        {parsedRows.length > 0 && (
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Successfully parsed {parsedRows.length} voyage rows</span>
              </div>

              {/* Append vs Replace Mode */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Action:</span>
                <select
                  value={uploadMode}
                  onChange={(e) => setUploadMode(e.target.value)}
                  className="bg-navy-900 border border-navy-800 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="append">Append to Current Fleet Data</option>
                  <option value="replace">Replace Entire Dataset</option>
                </select>
              </div>
            </div>

            {/* Preview snippet table */}
            <div className="overflow-x-auto rounded-xl border border-navy-800 max-h-48 text-[11px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-navy-900 border-b border-navy-800 text-slate-300">
                    <th className="py-2 px-3">Vessel</th>
                    <th className="py-2 px-3">Sector</th>
                    <th className="py-2 px-3">Period</th>
                    <th className="py-2 px-3 text-right">Income</th>
                    <th className="py-2 px-3 text-right">DOE</th>
                    <th className="py-2 px-3 text-right">PBT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800/60 bg-navy-950/50">
                  {parsedRows.slice(0, 5).map((r, i) => (
                    <tr key={i}>
                      <td className="py-1.5 px-3 font-medium text-white">{r.vessel}</td>
                      <td className="py-1.5 px-3 text-slate-300">{r.sector}</td>
                      <td className="py-1.5 px-3 text-slate-400">{r.month} {r.year}</td>
                      <td className="py-1.5 px-3 text-right font-mono text-sky-400">₹{formatNumber(r.Total_Income, true)}</td>
                      <td className="py-1.5 px-3 text-right font-mono text-orange-400">₹{formatNumber(r.DOE, true)}</td>
                      <td className="py-1.5 px-3 text-right font-mono text-rose-400">₹{formatNumber(r.PBT, true)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Commit Button */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCommit}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <span>Commit {parsedRows.length} Records to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
