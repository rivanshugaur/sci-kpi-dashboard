'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { KPI_META, KPI_KEYS } from '../lib/dataCleaner';
import { Layers, BarChart2, Table as TableIcon } from 'lucide-react';

export default function QuarterlyView({ data, invertSigns, isSingleYear }) {
  const [chartType, setChartType] = useState('chart');

  // Aggregate by Quarter or Quarter-Year
  const qMap = {};
  data.forEach((row) => {
    const qKey = isSingleYear ? (row.quarter || 'Q1') : (row.quarter_year || `${row.quarter} ${row.year}`);
    if (!qMap[qKey]) {
      qMap[qKey] = {
        name: qKey,
        year: row.year,
        quarter: row.quarter,
        Total_Income: 0,
        DOE: 0,
        IOE: 0,
        GOP: 0,
        PBT: 0,
      };
    }
    KPI_KEYS.forEach((k) => {
      qMap[qKey][k] += row[k] || 0;
    });
  });

  const chartData = Object.keys(qMap)
    .sort()
    .map((k) => {
      const row = qMap[k];
      const item = { name: row.name };
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
            Fiscal Quarter: {label}
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
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            Quarterly Fiscal Performance Review (Q1 – Q4)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluates seasonal charter rate variations and quarterly cost control performance.
          </p>
        </div>

        <div className="flex bg-navy-900 p-1 rounded-xl border border-navy-800">
          <button
            onClick={() => setChartType('chart')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartType === 'chart' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Chart
          </button>
          <button
            onClick={() => setChartType('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartType === 'table' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            Data
          </button>
        </div>
      </div>

      {/* Main View */}
      <div className="min-h-[380px]">
        {chartType === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-navy-800 bg-navy-900/60">
                  <th className="py-3 px-4 font-semibold text-slate-300">Quarter</th>
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
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
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
      </div>

    </div>
  );
}
