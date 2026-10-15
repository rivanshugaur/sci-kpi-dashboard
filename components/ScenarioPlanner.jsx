'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sliders, 
  Fuel, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  RotateCcw,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { formatLacs, formatNumber } from '../lib/dataCleaner';

export default function ScenarioPlanner({ isOpen, onClose, baseTotals, invertSigns }) {
  const [fuelVariance, setFuelVariance] = useState(0); // -30% to +30%
  const [charterVariance, setCharterVariance] = useState(0); // -30% to +30%

  if (!isOpen) return null;

  const baseInc = invertSigns ? -1 * baseTotals.Total_Income : baseTotals.Total_Income;
  const baseDoe = invertSigns ? -1 * baseTotals.DOE : baseTotals.DOE;
  const baseIoe = invertSigns ? -1 * baseTotals.IOE : baseTotals.IOE;
  const baseGop = invertSigns ? -1 * baseTotals.GOP : baseTotals.GOP;
  const basePbt = invertSigns ? -1 * baseTotals.PBT : baseTotals.PBT;

  // Adjusted figures based on sliders
  const simInc = baseInc * (1 + charterVariance / 100);
  const simDoe = baseDoe * (1 + fuelVariance / 100);
  const simGop = simInc - simDoe;
  const simPbt = simGop - baseIoe;

  const pbtDelta = simPbt - basePbt;
  const isPbtPositive = pbtDelta >= 0;

  const resetSliders = () => {
    setFuelVariance(0);
    setCharterVariance(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md">
      <div className="glass-card w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-sky-800/60 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-600 text-white shadow-lg shadow-sky-600/30">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Commercial Sensitivity Simulator</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Stress-test SCI fleet profitability against global bunker fuel price volatility and charter rate shifts.
            </p>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-6 bg-navy-900/60 border border-navy-800/80 rounded-2xl p-5 mb-6">
          
          {/* Charter Rate Variance Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-sky-400" />
                Charter Rate / Freight Market Variance
              </label>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                charterVariance > 0 ? 'text-emerald-400 bg-emerald-950' : (charterVariance < 0 ? 'text-rose-400 bg-rose-950' : 'text-slate-400 bg-navy-800')
              }`}>
                {charterVariance > 0 ? `+${charterVariance}%` : `${charterVariance}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              step="5"
              value={charterVariance}
              onChange={(e) => setCharterVariance(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>-30% Freight Slump</span>
              <span>Baseline (0%)</span>
              <span>+30% Bull Market</span>
            </div>
          </div>

          {/* Fuel / Bunker Price Variance Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Fuel className="w-4 h-4 text-orange-400" />
                Bunker Fuel & Voyage Cost (DOE) Variance
              </label>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                fuelVariance > 0 ? 'text-rose-400 bg-rose-950' : (fuelVariance < 0 ? 'text-emerald-400 bg-emerald-950' : 'text-slate-400 bg-navy-800')
              }`}>
                {fuelVariance > 0 ? `+${fuelVariance}% (Cost Surge)` : `${fuelVariance}% (Discount)`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              step="5"
              value={fuelVariance}
              onChange={(e) => setFuelVariance(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-orange-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>-30% Cheap Fuel</span>
              <span>Baseline (0%)</span>
              <span>+30% Bunker Surge</span>
            </div>
          </div>

        </div>

        {/* Projected Results Comparison */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-6">
          <div className="bg-navy-900/80 border border-navy-800 rounded-2xl p-4">
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Projected Revenue</span>
            <span className="text-lg font-bold text-sky-400 mt-1 block">
              ₹{simInc.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Lacs
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Base: ₹{baseInc.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="bg-navy-900/80 border border-navy-800 rounded-2xl p-4">
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Projected DOE</span>
            <span className="text-lg font-bold text-orange-400 mt-1 block">
              ₹{simDoe.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Lacs
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Base: ₹{baseDoe.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="bg-navy-900/80 border border-navy-800 rounded-2xl p-4 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Projected PBT</span>
            <span className={`text-lg font-bold mt-1 block ${simPbt >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ₹{simPbt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Lacs
            </span>
            <span className={`text-[10px] font-semibold mt-0.5 flex items-center gap-1 ${isPbtPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPbtPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPbtPositive ? '+' : ''}₹{pbtDelta.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Lacs delta
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={resetSliders}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Baseline
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-md shadow-sky-600/30"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
}
