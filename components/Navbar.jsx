'use client';

import React from 'react';
import { 
  Ship, 
  Upload, 
  Download, 
  User, 
  LogOut, 
  ShieldCheck, 
  RefreshCw,
  SlidersHorizontal,
  TableProperties
} from 'lucide-react';

export default function Navbar({ 
  auth, 
  onOpenLogin, 
  onLogout, 
  onOpenUpload, 
  currentTab, 
  setCurrentTab,
  invertSigns,
  setInvertSigns,
  onExportCSV,
  totalRecords
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-navy-800/80 bg-navy-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-sky-600 to-indigo-700 shadow-lg shadow-sky-900/30 text-white">
              <Ship className="w-7 h-7 text-sky-100" />
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-navy-950"></span>
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-sky-100 to-sky-400 bg-clip-text text-transparent">
                  SCI KPI Portal
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-950/90 text-sky-400 border border-sky-800/60 uppercase tracking-wider">
                  Navratna Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                The Shipping Corporation of India Ltd. • Fleet Financial Analytics
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 bg-navy-900/90 rounded-xl border border-navy-800/70">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Dashboard View
            </button>
            <button
              onClick={() => setCurrentTab('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'table'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              Data Explorer ({totalRecords})
            </button>
          </div>

          {/* Actions & User Section */}
          <div className="flex items-center gap-2.5">
            
            {/* Sign Convention Toggle */}
            <button
              onClick={() => setInvertSigns(!invertSigns)}
              title="Toggle SAP Debit/Credit accounting sign convention"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-navy-900 hover:bg-navy-800 border border-navy-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              <span>{invertSigns ? 'Display: Positive Values' : 'Display: Raw SAP'}</span>
            </button>

            {/* Export Button */}
            <button
              onClick={onExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-navy-900/90 hover:bg-navy-800 border border-navy-800 transition-all hover:border-slate-700"
              title="Export current view to CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Upload CSV */}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/20 transition-all active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload CSV</span>
            </button>

            {/* Authentication badge / button */}
            {auth.isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-navy-800">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-navy-900/80 border border-emerald-500/30 text-emerald-400 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-medium capitalize">{auth.username}</span>
                </div>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-navy-800/80 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-navy-900 hover:bg-navy-800 border border-navy-800 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
