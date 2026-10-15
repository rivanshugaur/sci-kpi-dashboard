'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Ship,
  Calendar
} from 'lucide-react';
import { KPI_META, KPI_KEYS, formatNumber } from '../lib/dataCleaner';

export default function DataTableView({ data, invertSigns, onExportCSV }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('year');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 15;

  // Search & Filter
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const s = searchTerm.toLowerCase();
      return (
        String(row.vessel || '').toLowerCase().includes(s) ||
        String(row.sector || '').toLowerCase().includes(s) ||
        String(row.vessel_code || '').toLowerCase().includes(s) ||
        String(row.year || '').includes(s) ||
        String(row.month || '').toLowerCase().includes(s) ||
        String(row.quarter || '').toLowerCase().includes(s)
      );
    });
  }, [data, searchTerm]);

  // Sort
  const sortedData = useMemo(() => {
    const list = [...filteredData];
    list.sort((a, b) => {
      let vA = a[sortField];
      let vB = b[sortField];

      if (KPI_KEYS.includes(sortField)) {
        vA = invertSigns ? -1 * (vA || 0) : (vA || 0);
        vB = invertSigns ? -1 * (vB || 0) : (vB || 0);
        return sortAsc ? vA - vB : vB - vA;
      }

      if (typeof vA === 'string') {
        return sortAsc ? vA.localeCompare(vB) : vB.localeCompare(vA);
      }
      return sortAsc ? (vA || 0) - (vB || 0) : (vB || 0) - (vA || 0);
    });
    return list;
  }, [filteredData, sortField, sortAsc, invertSigns]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-navy-800 space-y-5">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Ship className="w-5 h-5 text-sky-400" />
            Vessel Voyage Financial Ledger
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Granular records extracted from ERP/SAP accounting reports with verified voyage cost metrics.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search vessel, sector, year..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full bg-navy-900 border border-navy-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-navy-900 hover:bg-navy-800 border border-navy-800 text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-navy-800/80">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-navy-900/90 border-b border-navy-800 text-slate-300">
              <th 
                onClick={() => handleSort('year')} 
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  Year
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('month')} 
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  Month
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('sector')} 
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  Sector
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('vessel')} 
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  Vessel
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              
              {KPI_KEYS.map((k) => (
                <th
                  key={k}
                  onClick={() => handleSort(k)}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white whitespace-nowrap"
                  style={{ color: KPI_META[k].color }}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>{KPI_META[k].label} (₹ Lacs)</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-800/60 bg-navy-950/40">
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  No matching voyage records found. Try adjusting your search query or filters.
                </td>
              </tr>
            ) : (
              pageData.map((row, idx) => (
                <tr key={`${row.vessel}-${row.year}-${row.month}-${idx}`} className="hover:bg-navy-900/50 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-300">{row.year}</td>
                  <td className="py-2.5 px-3 text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-navy-900 text-[11px] border border-navy-800 font-medium">
                      {row.month}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-medium">{row.sector}</td>
                  <td className="py-2.5 px-3 font-semibold text-white">
                    <div className="flex items-center gap-1.5">
                      <Ship className="w-3 h-3 text-sky-400" />
                      <span>{row.vessel}</span>
                      {row.vessel_code && (
                        <span className="text-[10px] text-slate-500 font-mono">({row.vessel_code})</span>
                      )}
                    </div>
                  </td>
                  
                  {KPI_KEYS.map((k) => {
                    const raw = row[k];
                    const formatted = formatNumber(raw, invertSigns);
                    return (
                      <td key={k} className="py-2.5 px-3 text-right font-mono text-slate-200">
                        ₹{formatted}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 pt-2">
        <div>
          Showing {pageData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
          {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} records
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg border border-navy-800 hover:bg-navy-900 disabled:opacity-40 disabled:cursor-not-allowed text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>
            Page <strong className="text-white">{currentPage}</strong> of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg border border-navy-800 hover:bg-navy-900 disabled:opacity-40 disabled:cursor-not-allowed text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
