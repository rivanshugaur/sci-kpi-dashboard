'use client';

import React, { useMemo } from 'react';
import { 
  X, 
  Ship, 
  Anchor, 
  TrendingUp, 
  DollarSign, 
  Fuel, 
  Building2, 
  Award,
  Calendar,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { KPI_META, KPI_KEYS, formatLacs, formatNumber } from '../lib/dataCleaner';

export default function VesselModal({ vesselName, allData, invertSigns, onClose }) {
  if (!vesselName) return null;

  // Filter records for this specific vessel
  const vesselRecords = useMemo(() => {
    return allData.filter((d) => d.vessel === vesselName);
  }, [allData, vesselName]);

  // Aggregate stats
  const stats = useMemo(() => {
    const res = {
      Total_Income: 0,
      DOE: 0,
      IOE: 0,
      GOP: 0,
      PBT: 0,
      sector: vesselRecords[0]?.sector || 'Commercial Fleet',
      code: vesselRecords[0]?.vessel_code || 'SCI-V',
      count: vesselRecords.length,
    };
    vesselRecords.forEach((r) => {
      KPI_KEYS.forEach((k) => {
        res[k] += r[k] || 0;
      });
    });
    return res;
  }, [vesselRecords]);

  const inc = invertSigns ? -1 * stats.Total_Income : stats.Total_Income;
  const doe = invertSigns ? -1 * stats.DOE : stats.DOE;
  const gop = invertSigns ? -1 * stats.GOP : stats.GOP;
  const pbt = invertSigns ? -1 * stats.PBT : stats.PBT;

  const gopMargin = inc > 0 ? ((gop / inc) * 100).toFixed(1) : '0.0';
  const pbtMargin = inc > 0 ? ((pbt / inc) * 100).toFixed(1) : '0.0';
  const doeRatio = inc > 0 ? ((doe / inc) * 100).toFixed(1) : '0.0';
  const avgMonthly = stats.count > 0 ? (inc / stats.count).toFixed(2) : '0.00';

  // Monthly breakdown chart data
  const monthlyData = useMemo(() => {
    const sorted = [...vesselRecords].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return (a.month_index || 1) - (b.month_index || 1);
    });

    return sorted.slice(-12).map((r) => ({
      name: `${r.month?.slice(0, 3)} ${r.year}`,
      Total_Income: invertSigns ? -1 * r.Total_Income : r.Total_Income,
      DOE: invertSigns ? -1 * r.DOE : r.DOE,
      GOP: invertSigns ? -1 * r.GOP : r.GOP,
      PBT: invertSigns ? -1 * r.PBT : r.PBT,
    }));
  }, [vesselRecords, invertSigns]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md">
      <div className="glass-card w-full max-w-4xl rounded-3xl p-6 sm:p-8 border border-sky-800/50 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Vessel Header Dossier */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-navy-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-sky-600/30">
              <Ship className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {vesselName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-950 border border-sky-800 text-sky-400">
                  {stats.code}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/80 border border-emerald-800 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active In Fleet
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>Sector: <strong className="text-slate-200">{stats.sector}</strong></span>
                <span>•</span>
                <span>Registry: <strong className="text-slate-200">🇮🇳 Mumbai, India</strong></span>
                <span>•</span>
                <span>Logged Voyages: <strong className="text-sky-400">{stats.count} Periods</strong></span>
              </p>
            </div>
          </div>
        </div>

        {/* Key Operational KPI Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6">
          <div className="bg-navy-900/80 border border-navy-800 rounded-2xl p-3.5">
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Gross Income</span>
            <span className="text-lg font-bold text-sky-400 mt-1 block">
              {formatLacs(stats.Total_Income, invertSigns)}
            </span>
            <span className="text-[10px] text-slate-500">Avg ₹{avgMonthly} Lacs/mo</span>
          </div>

          <div className="bg-navy-900/80 border border-navy-800 rounded-2xl p-3.5">
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Direct Operating (DOE)</span>
            <span className="text-lg font-bold text-orange-400 mt-1 block">
              {formatLacs(stats.DOE, invertSigns)}
            </span>
            <span className="text-[10px] text-slate-500">{doeRatio}% bunker & voyage costs</span>
          </div>

          <div className="bg-navy-900/80 border border-navy-800 rounded-2xl p-3.5">
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Gross Profit (GOP)</span>
            <span className="text-lg font-bold text-purple-400 mt-1 block">
              {formatLacs(stats.GOP, invertSigns)}
            </span>
            <span className="text-[10px] text-purple-400 font-semibold">{gopMargin}% Operating Margin</span>
          </div>

          <div className="bg-navy-900/80 border border-navy-800 rounded-2xl p-3.5">
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Profit Before Tax (PBT)</span>
            <span className="text-lg font-bold text-rose-400 mt-1 block">
              {formatLacs(stats.PBT, invertSigns)}
            </span>
            <span className="text-[10px] text-rose-400 font-semibold">{pbtMargin}% Bottomline Margin</span>
          </div>
        </div>

        {/* Chart: Recent Trajectory */}
        <div className="bg-navy-900/50 border border-navy-800 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              Voyage Trajectory (Last 12 Recorded Periods)
            </h4>
            <span className="text-[10px] text-slate-400">Values in ₹ Lacs</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b1329', borderColor: '#1e3a8a', borderRadius: '12px' }}
                />
                <Legend verticalAlign="top" height={32} />
                <Bar dataKey="Total_Income" name="Income" fill="#38bdf8" radius={[3, 3, 0, 0]} />
                <Bar dataKey="DOE" name="DOE" fill="#f97316" radius={[3, 3, 0, 0]} />
                <Bar dataKey="GOP" name="GOP" fill="#a855f7" radius={[3, 3, 0, 0]} />
                <Bar dataKey="PBT" name="PBT" fill="#ef4444" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-md shadow-sky-600/30"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
}
