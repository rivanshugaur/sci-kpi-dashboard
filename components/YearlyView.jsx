'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { KPI_META, KPI_KEYS, formatLacs, formatNumber } from '../lib/dataCleaner';
import { BarChart2, TrendingUp, Table as TableIcon } from 'lucide-react';

export default function YearlyView({ data, invertSigns }) {
  const [chartType, setChartType] = useState('bar'); // 'bar' | 'line' | 'table'
  const [activeKpi, setActiveKpi] = useState('all');

  // Aggregate by Year
  const yearMap = {};
  data.forEach((row) => {
    const yr = row.year;
    if (!yearMap[yr]) {
      yearMap[yr] = {
        year: yr,
        Total_Income: 0,
        DOE: 0,
        IOE: 0,
        GOP: 0,
        PBT: 0,
      };
    }
    KPI_KEYS.forEach((k) => {
      yearMap[yr][k] += row[k] || 0;
    });
  });

  const chartData = Object.keys(yearMap)
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
    .map((yr) => {
      const row = yearMap[yr];
      const item = { year: yr };
      KPI_KEYS.forEach((k) => {
        const raw = row[k];
        item[k] = invertSigns ? Math.round(-1 * raw * 100) / 100 : Math.round(raw * 100) / 100;
      });
      return item;
    });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy-900/95 border border-navy-700 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs">
          <p className="font-bold text-white mb-2 text-sm border-b border-navy-700/60 pb-1">
            Financial Year: {label}
          </p>
          <div className="space-y-1.5">
            {payload.map((entry, index) => (
              <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: entry.color }}
                  />
                  {KPI_META[entry.dataKey]?.short || entry.dataKey}:
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
      {/* View Header & Controls */}
      <div className="glass-card rounded-2xl p-5 border border-navy-800">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-400" />
              Annual Multi-Year Fleet Financial Trends
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative analysis of SCI fleet earnings, operational expenditure, and pre-tax profit margins.
            </p>
          </div>

          {/* Toggle View Options */}
          <div className="flex items-center gap-2">
            <div className="flex bg-navy-900 p-1 rounded-xl border border-navy-800">
              <button
                onClick={() => setChartType('bar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  chartType === 'bar' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                Bar Chart
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  chartType === 'line' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Line Trend
              </button>
              <button
                onClick={() => setChartType('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  chartType === 'table' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                Table View
              </button>
            </div>
          </div>
        </div>

        {/* KPI Focus Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-t border-navy-800/60 pt-3">
          <span className="text-xs text-slate-400 font-medium">Highlight:</span>
          <button
            onClick={() => setActiveKpi('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeKpi === 'all'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:bg-navy-800'
            }`}
          >
            All Metrics
          </button>
          {KPI_KEYS.map((k) => (
            <button
              key={k}
              onClick={() => setActiveKpi(k)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeKpi === k
                  ? 'bg-navy-800 text-white border border-sky-500/50'
                  : 'text-slate-400 hover:bg-navy-800/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: KPI_META[k].color }} />
              {KPI_META[k].short}
            </button>
          ))}
        </div>

        {/* Chart or Table Presentation */}
        <div className="mt-4 min-h-[360px]">
          {chartType === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-navy-800 bg-navy-900/60">
                    <th className="py-3 px-4 font-semibold text-slate-300">Financial Year</th>
                    {KPI_KEYS.map((k) => (
                      <th key={k} className="py-3 px-4 font-semibold text-right" style={{ color: KPI_META[k].color }}>
                        {KPI_META[k].label} (₹ Lacs)
                      </th>
                    ))}
                    <th className="py-3 px-4 font-semibold text-right text-slate-300">GOP Margin</th>
                    <th className="py-3 px-4 font-semibold text-right text-slate-300">PBT Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800/60">
                  {chartData.map((row) => {
                    const inc = row.Total_Income || 1;
                    const gopM = ((row.GOP / inc) * 100).toFixed(1);
                    const pbtM = ((row.PBT / inc) * 100).toFixed(1);
                    return (
                      <tr key={row.year} className="hover:bg-navy-800/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">{row.year}</td>
                        {KPI_KEYS.map((k) => (
                          <td key={k} className="py-3 px-4 text-right font-medium text-slate-200">
                            ₹{row[k].toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                        ))}
                        <td className="py-3 px-4 text-right font-semibold text-purple-400">{gopM}%</td>
                        <td className="py-3 px-4 text-right font-semibold text-rose-400">{pbtM}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={380}>
              {chartType === 'bar' ? (
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {KPI_KEYS.filter((k) => activeKpi === 'all' || activeKpi === k).map((k) => (
                    <Bar
                      key={k}
                      dataKey={k}
                      name={KPI_META[k].short}
                      fill={KPI_META[k].color}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              ) : (
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {KPI_KEYS.filter((k) => activeKpi === 'all' || activeKpi === k).map((k) => (
                    <Line
                      key={k}
                      type="monotone"
                      dataKey={k}
                      name={KPI_META[k].short}
                      stroke={KPI_META[k].color}
                      strokeWidth={3}
                      dot={{ r: 5, fill: KPI_META[k].color }}
                    />
                  ))}
                </LineChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Individual KPI Mini-Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {KPI_KEYS.map((k) => {
          const meta = KPI_META[k];
          return (
            <div key={k} className="glass-card rounded-xl p-4 border border-navy-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                  {meta.label} Trend
                </span>
                <span className="text-[10px] text-slate-400">Annual</span>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey={k} fill={meta.color} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
