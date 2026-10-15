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
import { KPI_META, KPI_KEYS, MONTHS, MONTH_ORDER } from '../lib/dataCleaner';
import { Calendar, BarChart2, Table as TableIcon } from 'lucide-react';

export default function MonthlyView({ data, invertSigns }) {
  const [barmode, setBarmode] = useState('stack'); // 'stack' | 'group'
  const [viewMode, setViewMode] = useState('chart'); // 'chart' | 'table'

  // Aggregate by Month-Year
  const monthMap = {};
  data.forEach((row) => {
    const key = `${row.year}-${String(row.month_index || 1).padStart(2, '0')}`;
    const displayLabel = `${row.month?.slice(0, 3)} ${row.year}`;

    if (!monthMap[key]) {
      monthMap[key] = {
        key: key,
        label: displayLabel,
        year: row.year,
        month: row.month,
        monthIndex: row.month_index || 1,
        Total_Income: 0,
        DOE: 0,
        IOE: 0,
        GOP: 0,
        PBT: 0,
      };
    }

    KPI_KEYS.forEach((k) => {
      monthMap[key][k] += row[k] || 0;
    });
  });

  const chartData = Object.keys(monthMap)
    .sort()
    .map((k) => {
      const row = monthMap[k];
      const item = {
        name: row.label,
        year: row.year,
        month: row.month,
      };
      KPI_KEYS.forEach((kpi) => {
        const raw = row[kpi];
        item[kpi] = invertSigns ? Math.round(-1 * raw * 100) / 100 : Math.round(raw * 100) / 100;
      });
      return item;
    });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy-900/95 border border-navy-700 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs">
          <p className="font-bold text-white mb-2 text-sm border-b border-navy-700/60 pb-1">
            Period: {label}
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
    <div className="glass-card rounded-2xl p-5 border border-navy-800 space-y-6">
      
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-400" />
            Monthly Fleet Trajectory & Variance Analysis
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Breakdown of revenue, fuel/voyage expenditure (DOE), overheads (IOE), and profits across selected months.
          </p>
        </div>

        {/* View Options */}
        <div className="flex items-center gap-2">
          {viewMode === 'chart' && (
            <div className="flex bg-navy-900 p-1 rounded-xl border border-navy-800">
              <button
                onClick={() => setBarmode('stack')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  barmode === 'stack' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Stacked
              </button>
              <button
                onClick={() => setBarmode('group')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  barmode === 'group' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Grouped
              </button>
            </div>
          )}

          <div className="flex bg-navy-900 p-1 rounded-xl border border-navy-800">
            <button
              onClick={() => setViewMode('chart')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'chart' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Chart
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              Data
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart or Table */}
      <div className="min-h-[400px]">
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-navy-800 bg-navy-900/60">
                  <th className="py-3 px-4 font-semibold text-slate-300">Period</th>
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
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#94a3b8" angle={-30} textAnchor="end" height={50} />
              <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              {KPI_KEYS.map((k) => (
                <Bar
                  key={k}
                  dataKey={k}
                  name={KPI_META[k].short}
                  fill={KPI_META[k].color}
                  stackId={barmode === 'stack' ? 'a' : undefined}
                  radius={barmode === 'group' ? [4, 4, 0, 0] : undefined}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}
