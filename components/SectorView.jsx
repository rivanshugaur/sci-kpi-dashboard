'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { KPI_META, KPI_KEYS } from '../lib/dataCleaner';
import { PieChart as PieIcon, BarChart2, Table as TableIcon } from 'lucide-react';

const SECTOR_COLORS = ['#38bdf8', '#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#f97316'];

export default function SectorView({ data, invertSigns }) {
  const [activeTab, setActiveTab] = useState('chart');

  // Aggregate by Sector
  const sectorMap = {};
  data.forEach((row) => {
    const sec = row.sector || 'Unassigned';
    if (!sectorMap[sec]) {
      sectorMap[sec] = {
        name: sec,
        Total_Income: 0,
        DOE: 0,
        IOE: 0,
        GOP: 0,
        PBT: 0,
      };
    }
    KPI_KEYS.forEach((k) => {
      sectorMap[sec][k] += row[k] || 0;
    });
  });

  const chartData = Object.keys(sectorMap)
    .sort()
    .map((sec) => {
      const row = sectorMap[sec];
      const item = { name: sec };
      KPI_KEYS.forEach((kpi) => {
        const raw = row[kpi];
        item[kpi] = invertSigns ? Math.round(-1 * raw * 100) / 100 : Math.round(raw * 100) / 100;
      });
      return item;
    });

  // Calculate sector income distribution for pie chart
  const pieData = chartData.map((d) => ({
    name: d.name,
    value: Math.max(0, d.Total_Income),
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy-900/95 border border-navy-700 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs">
          <p className="font-bold text-white mb-2 text-sm border-b border-navy-700/60 pb-1">
            Sector: {label}
          </p>
          <div className="space-y-1.5">
            {payload.map((entry, index) => (
              <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: entry.color }}
                  />
                  {KPI_META[entry.dataKey]?.short || entry.name || entry.dataKey}:
                </span>
                <span className="font-semibold text-white">
                  ₹{Number(entry.value).toLocaleString('en-IN', { minimumFractionDigits: 2 })} Lacs
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-5 border border-navy-800">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-sky-400" />
              Sector-Wise Strategic Performance Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cross-sector comparison of crude tankers, product tankers, bulk carriers, offshore & liners.
            </p>
          </div>

          <div className="flex bg-navy-900 p-1 rounded-xl border border-navy-800">
            <button
              onClick={() => setActiveTab('chart')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'chart' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Bar Matrix
            </button>
            <button
              onClick={() => setActiveTab('share')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'share' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              Revenue Share
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'table' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              Sector Table
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[380px]">
          {activeTab === 'table' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-navy-800 bg-navy-900/60">
                    <th className="py-3 px-4 font-semibold text-slate-300">Sector</th>
                    {KPI_KEYS.map((k) => (
                      <th key={k} className="py-3 px-4 font-semibold text-right" style={{ color: KPI_META[k].color }}>
                        {KPI_META[k].label} (₹ Lacs)
                      </th>
                    ))}
                    <th className="py-3 px-4 font-semibold text-right text-slate-300">GOP Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800/60">
                  {chartData.map((row) => {
                    const inc = row.Total_Income || 1;
                    const gopM = ((row.GOP / inc) * 100).toFixed(1);
                    return (
                      <tr key={row.name} className="hover:bg-navy-800/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">{row.name}</td>
                        {KPI_KEYS.map((k) => (
                          <td key={k} className="py-3 px-4 text-right font-medium text-slate-200">
                            ₹{row[k].toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                        ))}
                        <td className="py-3 px-4 text-right font-semibold text-purple-400">{gopM}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'chart' && (
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} />
                {KPI_KEYS.map((k) => (
                  <Bar
                    key={k}
                    dataKey={k}
                    name={KPI_META[k].short}
                    fill={KPI_META[k].color}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'share' && (
            <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-4">
              <div className="w-full md:w-1/2 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      innerRadius={60}
                      paddingAngle={4}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SECTOR_COLORS[index % SECTOR_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full md:w-1/2 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Sector Revenue Contribution
                </h4>
                {pieData.map((entry, index) => {
                  const total = pieData.reduce((acc, curr) => acc + curr.value, 0) || 1;
                  const pct = ((entry.value / total) * 100).toFixed(1);
                  return (
                    <div key={entry.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: SECTOR_COLORS[index % SECTOR_COLORS.length] }}
                        />
                        <span className="font-semibold text-white">{entry.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">{pct}%</span>
                        <span className="font-mono text-slate-200">
                          ₹{entry.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Lacs
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
