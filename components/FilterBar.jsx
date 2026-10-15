'use client';

import React from 'react';
import { 
  Calendar, 
  Layers, 
  Ship, 
  PieChart, 
  BarChart3, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { MONTHS } from '../lib/dataCleaner';

export const ANALYSIS_MODES = [
  { id: 'yearly', label: 'Yearly Analysis', icon: Calendar, desc: 'Multi-year financial comparison' },
  { id: 'monthly', label: 'Monthly Analysis', icon: BarChart3, desc: 'Month-on-month trend tracking' },
  { id: 'quarterly', label: 'Quarterly Analysis', icon: Layers, desc: 'Q1-Q4 fiscal quarter performance' },
  { id: 'sector', label: 'Sector-wise Analysis', icon: PieChart, desc: 'Performance across vessel categories' },
  { id: 'vessel', label: 'Vessel-wise Analysis', icon: Ship, desc: 'Individual vessel fleet benchmarking' },
];

export default function FilterBar({
  mode,
  setMode,
  availableYears,
  availableSectors,
  availableVessels,
  filters,
  setFilters,
  onResetFilters,
  filteredCount,
  totalCount
}) {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  const toggleQuarter = (q) => {
    const current = filters.quarters || [];
    if (current.includes(q)) {
      if (current.length > 1) {
        setFilters(prev => ({ ...prev, quarters: current.filter(x => x !== q) }));
      }
    } else {
      setFilters(prev => ({ ...prev, quarters: [...current, q] }));
    }
  };

  // Quick Preset Handlers
  const applyPreset = (presetType) => {
    if (presetType === 'all') {
      onResetFilters();
    } else if (presetType === 'tankers') {
      setFilters(prev => ({ ...prev, sector: 'Crude Tanker' }));
    } else if (presetType === 'bulk') {
      setFilters(prev => ({ ...prev, sector: 'Bulk Carrier' }));
    } else if (presetType === 'offshore') {
      setFilters(prev => ({ ...prev, sector: 'Offshore Supply' }));
    } else if (presetType === 'latest') {
      const latestYr = availableYears[availableYears.length - 1];
      setFilters(prev => ({ ...prev, fromYear: latestYr, toYear: latestYr }));
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 mb-6 border border-navy-800 space-y-4">
      
      {/* Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-800/80 pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
          {ANALYSIS_MODES.map((item) => {
            const Icon = item.icon;
            const isActive = mode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setMode(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-navy-800/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Status / Reset */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            Showing <strong className="text-sky-400 font-semibold">{filteredCount}</strong> of {totalCount} records
          </span>
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-navy-800 border border-navy-800 transition-colors"
            title="Reset filters"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Quick Filter Presets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-sky-400" />
          Presets:
        </span>
        <button
          onClick={() => applyPreset('all')}
          className="px-2.5 py-1 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-300 hover:text-white border border-navy-800 transition-colors"
        >
          All Fleet
        </button>
        <button
          onClick={() => applyPreset('tankers')}
          className="px-2.5 py-1 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-300 hover:text-white border border-navy-800 transition-colors"
        >
          Crude Tankers
        </button>
        <button
          onClick={() => applyPreset('bulk')}
          className="px-2.5 py-1 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-300 hover:text-white border border-navy-800 transition-colors"
        >
          Bulk Carriers
        </button>
        <button
          onClick={() => applyPreset('offshore')}
          className="px-2.5 py-1 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-300 hover:text-white border border-navy-800 transition-colors"
        >
          Offshore Fleet
        </button>
        <button
          onClick={() => applyPreset('latest')}
          className="px-2.5 py-1 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-300 hover:text-white border border-navy-800 transition-colors"
        >
          Latest FY Only
        </button>
      </div>

      {/* Dynamic Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5 items-end pt-2 border-t border-navy-800/60">
        
        {/* From Year */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            From Year
          </label>
          <select
            value={filters.fromYear}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setFilters(prev => ({
                ...prev,
                fromYear: val,
                toYear: Math.max(val, prev.toYear)
              }));
            }}
            className="w-full bg-navy-900 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors"
          >
            {availableYears.map(yr => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
        </div>

        {/* To Year */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            To Year
          </label>
          <select
            value={filters.toYear}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setFilters(prev => ({ ...prev, toYear: val }));
            }}
            className="w-full bg-navy-900 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors"
          >
            {availableYears.filter(yr => yr >= filters.fromYear).map(yr => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
        </div>

        {/* Month range */}
        {mode !== 'quarterly' && mode !== 'yearly' && (
          <>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                From Month
              </label>
              <select
                value={filters.fromMonth}
                onChange={(e) => setFilters(prev => ({ ...prev, fromMonth: e.target.value }))}
                className="w-full bg-navy-900 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors"
              >
                {MONTHS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                To Month
              </label>
              <select
                value={filters.toMonth}
                onChange={(e) => setFilters(prev => ({ ...prev, toMonth: e.target.value }))}
                className="w-full bg-navy-900 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors"
              >
                {MONTHS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Quarters (if quarterly view) */}
        {mode === 'quarterly' && (
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
              Filter Quarters
            </label>
            <div className="flex items-center gap-1.5">
              {quarters.map(q => {
                const isSelected = (filters.quarters || []).includes(q);
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => toggleQuarter(q)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-sky-600/90 border-sky-500 text-white shadow-sm'
                        : 'bg-navy-900 border-navy-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {q}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Sector Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            Sector Filter
          </label>
          <select
            value={filters.sector}
            onChange={(e) => setFilters(prev => ({ ...prev, sector: e.target.value }))}
            className="w-full bg-navy-900 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors"
          >
            <option value="All">All Sectors</option>
            {availableSectors.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Vessel Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            Vessel Filter
          </label>
          <select
            value={filters.vessel}
            onChange={(e) => setFilters(prev => ({ ...prev, vessel: e.target.value }))}
            className="w-full bg-navy-900 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors"
          >
            <option value="All">All Vessels</option>
            {availableVessels.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}
