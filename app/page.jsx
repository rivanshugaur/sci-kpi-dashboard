'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import KPICards from '../components/KPICard';
import FilterBar from '../components/FilterBar';
import YearlyView from '../components/YearlyView';
import MonthlyView from '../components/MonthlyView';
import QuarterlyView from '../components/QuarterlyView';
import SectorView from '../components/SectorView';
import VesselView from '../components/VesselView';
import DataTableView from '../components/DataTableView';
import UploadModal from '../components/UploadModal';
import AuthModal from '../components/AuthModal';
import { DEFAULT_KPI_DATA } from '../lib/defaultData';
import { MONTH_ORDER, KPI_KEYS } from '../lib/dataCleaner';
import { Ship, Anchor, Compass, TrendingUp, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState(DEFAULT_KPI_DATA);
  const [currentTab, setCurrentTab] = useState('dashboard'); // 'dashboard' | 'table'
  const [mode, setMode] = useState('yearly'); // 'yearly' | 'monthly' | 'quarterly' | 'sector' | 'vessel'
  const [invertSigns, setInvertSigns] = useState(true); // Positive values default
  
  // Auth state
  const [auth, setAuth] = useState({
    isAuthenticated: true,
    username: 'admin',
    role: 'Administrator',
  });

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Available filter options derived from dataset
  const availableYears = useMemo(() => {
    const yrs = Array.from(new Set(data.map((d) => d.year).filter(Boolean)));
    return yrs.sort((a, b) => a - b);
  }, [data]);

  const availableSectors = useMemo(() => {
    const secs = Array.from(new Set(data.map((d) => d.sector).filter(Boolean)));
    return secs.sort();
  }, [data]);

  const availableVessels = useMemo(() => {
    const ves = Array.from(new Set(data.map((d) => d.vessel).filter(Boolean)));
    return ves.sort();
  }, [data]);

  // Filters state
  const [filters, setFilters] = useState({
    fromYear: availableYears[0] || 2022,
    toYear: availableYears[availableYears.length - 1] || 2025,
    fromMonth: 'January',
    toMonth: 'December',
    quarters: ['Q1', 'Q2', 'Q3', 'Q4'],
    sector: 'All',
    vessel: 'All',
  });

  const handleResetFilters = () => {
    setFilters({
      fromYear: availableYears[0] || 2022,
      toYear: availableYears[availableYears.length - 1] || 2025,
      fromMonth: 'January',
      toMonth: 'December',
      quarters: ['Q1', 'Q2', 'Q3', 'Q4'],
      sector: 'All',
      vessel: 'All',
    });
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Year filter
      if (row.year < filters.fromYear || row.year > filters.toYear) return false;

      // Quarterly filter mode
      if (mode === 'quarterly') {
        if (filters.quarters && filters.quarters.length > 0) {
          if (!filters.quarters.includes(row.quarter)) return false;
        }
      } else if (mode !== 'yearly') {
        // Month filter
        const fromIdx = MONTH_ORDER[filters.fromMonth] || 1;
        const toIdx = MONTH_ORDER[filters.toMonth] || 12;
        const rowMIdx = row.month_index || MONTH_ORDER[row.month] || 1;
        if (rowMIdx < fromIdx || rowMIdx > toIdx) return false;
      }

      // Sector filter
      if (filters.sector !== 'All' && row.sector !== filters.sector) return false;

      // Vessel filter
      if (filters.vessel !== 'All' && row.vessel !== filters.vessel) return false;

      return true;
    });
  }, [data, filters, mode]);

  // Aggregate KPI totals
  const totals = useMemo(() => {
    const res = {
      Total_Income: 0,
      DOE: 0,
      IOE: 0,
      GOP: 0,
      PBT: 0,
    };
    filteredData.forEach((row) => {
      KPI_KEYS.forEach((k) => {
        res[k] += row[k] || 0;
      });
    });
    return res;
  }, [filteredData]);

  // Handle uploaded data
  const handleDataUploaded = (newRows, uploadMode) => {
    if (uploadMode === 'replace') {
      setData(newRows);
    } else {
      setData((prev) => [...prev, ...newRows]);
    }
  };

  // Export current filtered view to CSV
  const handleExportCSV = () => {
    if (filteredData.length === 0) return;

    const headers = ['Year', 'Month', 'Quarter', 'Sector', 'Vessel', 'Vessel Code', 'Total Income', 'DOE', 'IOE', 'GOP', 'PBT'];
    const rows = filteredData.map((d) => [
      d.year,
      d.month,
      d.quarter,
      `"${d.sector}"`,
      `"${d.vessel}"`,
      d.vessel_code || '',
      invertSigns ? -1 * d.Total_Income : d.Total_Income,
      invertSigns ? -1 * d.DOE : d.DOE,
      invertSigns ? -1 * d.IOE : d.IOE,
      invertSigns ? -1 * d.GOP : d.GOP,
      invertSigns ? -1 * d.PBT : d.PBT,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sci_kpi_export_${filters.fromYear}_${filters.toYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 pb-16">
      
      {/* Top Navigation */}
      <Navbar
        auth={auth}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={() => setAuth({ isAuthenticated: false, username: '', role: '' })}
        onOpenUpload={() => setIsUploadOpen(true)}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        invertSigns={invertSigns}
        setInvertSigns={setInvertSigns}
        onExportCSV={handleExportCSV}
        totalRecords={data.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full flex-1">
        
        {/* Executive Banner */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 mb-6 bg-gradient-to-r from-blue-950 via-navy-900 to-indigo-950 border border-sky-900/40 shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
            <Ship className="w-80 h-80 text-white" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-900/40 border border-sky-700/50 text-sky-300 text-xs font-semibold mb-3">
              <Compass className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '12s' }} />
              Fleet Operations & Commercial Charter Intelligence
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Shipping Corporation of India
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
              Executive performance dashboard monitoring voyage operating costs (DOE/IOE), gross operating profits, and vessel profitability metrics across global maritime shipping routes.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1.5 bg-navy-950/60 px-3 py-1.5 rounded-xl border border-navy-800">
                <Ship className="w-3.5 h-3.5 text-sky-400" />
                Fleet Active: <strong className="text-white">{availableVessels.length} Vessels</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-navy-950/60 px-3 py-1.5 rounded-xl border border-navy-800">
                <Anchor className="w-3.5 h-3.5 text-emerald-400" />
                Sectors Monitored: <strong className="text-white">{availableSectors.length} Sectors</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-navy-950/60 px-3 py-1.5 rounded-xl border border-navy-800">
                <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                Accounting Std: <strong className="text-sky-300">₹ in Lacs (INR)</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Top KPI Metric Cards */}
        <div className="mb-6">
          <KPICards totals={totals} invertSigns={invertSigns} />
        </div>

        {/* View Switcher: Dashboard or Full Table */}
        {currentTab === 'table' ? (
          <DataTableView
            data={filteredData}
            invertSigns={invertSigns}
            onExportCSV={handleExportCSV}
          />
        ) : (
          <>
            {/* Filter Bar */}
            <FilterBar
              mode={mode}
              setMode={setMode}
              availableYears={availableYears}
              availableSectors={availableSectors}
              availableVessels={availableVessels}
              filters={filters}
              setFilters={setFilters}
              onResetFilters={handleResetFilters}
              filteredCount={filteredData.length}
              totalCount={data.length}
            />

            {/* Empty State Guard */}
            {filteredData.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center border border-navy-800">
                <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">No Voyage Records Match Filters</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Try adjusting the year span, selecting additional quarters, or resetting sector and vessel selections.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Specific Analysis View */
              <div>
                {mode === 'yearly' && (
                  <YearlyView data={filteredData} invertSigns={invertSigns} />
                )}
                {mode === 'monthly' && (
                  <MonthlyView data={filteredData} invertSigns={invertSigns} />
                )}
                {mode === 'quarterly' && (
                  <QuarterlyView
                    data={filteredData}
                    invertSigns={invertSigns}
                    isSingleYear={filters.fromYear === filters.toYear}
                  />
                )}
                {mode === 'sector' && (
                  <SectorView data={filteredData} invertSigns={invertSigns} />
                )}
                {mode === 'vessel' && (
                  <VesselView data={filteredData} invertSigns={invertSigns} />
                )}
              </div>
            )}
          </>
        )}

      </main>

      {/* Upload CSV Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDataUploaded={handleDataUploaded}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(user) => {
          setAuth({
            isAuthenticated: true,
            username: user.username,
            role: user.role,
          });
        }}
      />

    </div>
  );
}
