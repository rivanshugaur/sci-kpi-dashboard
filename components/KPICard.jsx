'use client';

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Fuel, 
  Building2, 
  Award, 
  Percent 
} from 'lucide-react';
import { KPI_META, formatLacs } from '../lib/dataCleaner';

const KPI_ICONS = {
  Total_Income: DollarSign,
  DOE: Fuel,
  IOE: Building2,
  GOP: Award,
  PBT: TrendingUp,
};

export default function KPICards({ totals, invertSigns }) {
  // Calculate key operational ratios
  const income = invertSigns ? -1 * (totals.Total_Income || 0) : (totals.Total_Income || 0);
  const doe = invertSigns ? -1 * (totals.DOE || 0) : (totals.DOE || 0);
  const ioe = invertSigns ? -1 * (totals.IOE || 0) : (totals.IOE || 0);
  const gop = invertSigns ? -1 * (totals.GOP || 0) : (totals.GOP || 0);
  const pbt = invertSigns ? -1 * (totals.PBT || 0) : (totals.PBT || 0);

  const gopMargin = income > 0 ? ((gop / income) * 100).toFixed(1) : '0.0';
  const pbtMargin = income > 0 ? ((pbt / income) * 100).toFixed(1) : '0.0';
  const doeRatio = income > 0 ? ((doe / income) * 100).toFixed(1) : '0.0';
  const ioeRatio = income > 0 ? ((ioe / income) * 100).toFixed(1) : '0.0';

  const cards = [
    {
      key: 'Total_Income',
      title: 'Total Income',
      subtitle: 'Fleet Gross Revenue',
      badge: 'Revenue',
      badgeColor: 'text-sky-400 bg-sky-950/80 border-sky-800/60',
      value: totals.Total_Income,
      subValue: 'Base operational charter earnings'
    },
    {
      key: 'DOE',
      title: 'Direct Operating Exp. (DOE)',
      subtitle: `${doeRatio}% of Income`,
      badge: 'Voyage Costs',
      badgeColor: 'text-orange-400 bg-orange-950/80 border-orange-800/60',
      value: totals.DOE,
      subValue: 'Bunkers, port dues, canal fees, crew'
    },
    {
      key: 'IOE',
      title: 'Indirect Operating Exp. (IOE)',
      subtitle: `${ioeRatio}% of Income`,
      badge: 'Overheads',
      badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-800/60',
      value: totals.IOE,
      subValue: 'Admin overheads, insurance, shore cost'
    },
    {
      key: 'GOP',
      title: 'Gross Operating Profit (GOP)',
      subtitle: `${gopMargin}% Margin`,
      badge: 'Operational Surplus',
      badgeColor: 'text-purple-400 bg-purple-950/80 border-purple-800/60',
      value: totals.GOP,
      subValue: 'Operational earnings before IOE'
    },
    {
      key: 'PBT',
      title: 'Profit Before Tax (PBT)',
      subtitle: `${pbtMargin}% Net Margin`,
      badge: 'Bottomline',
      badgeColor: 'text-rose-400 bg-rose-950/80 border-rose-800/60',
      value: totals.PBT,
      subValue: 'Surplus before tax, interest, depreciation'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = KPI_ICONS[card.key] || DollarSign;
        const meta = KPI_META[card.key];
        const valFormatted = formatLacs(card.value, invertSigns);

        return (
          <div
            key={card.key}
            className="glass-card glass-card-hover rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group"
          >
            {/* Top border colored stripe */}
            <div 
              className="absolute top-0 left-0 right-0 h-1" 
              style={{ backgroundColor: meta.color }}
            />

            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 truncate pr-2">
                  {meta.short}
                </span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>

              {/* Amount */}
              <div className="mt-1">
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
                  {valFormatted}
                </div>
                <div className="text-xs font-medium text-slate-300 mt-1 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }}></span>
                  {card.subtitle}
                </div>
              </div>
            </div>

            {/* Description tooltip / footer */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/60 text-[11px] text-slate-400 line-clamp-1">
              {card.subValue}
            </div>
          </div>
        );
      })}
    </div>
  );
}
