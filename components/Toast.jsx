'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400" />,
    info: <Info className="w-4 h-4 text-sky-400" />
  };

  const borders = {
    success: 'border-emerald-500/40 bg-emerald-950/90 text-emerald-100',
    error: 'border-rose-500/40 bg-rose-950/90 text-rose-100',
    info: 'border-sky-500/40 bg-navy-900/95 text-sky-100'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-md transition-all animate-bounce-short">
      <div className={`p-1.5 rounded-xl border ${borders[toast.type || 'info']}`}>
        {icons[toast.type || 'info']}
      </div>
      <div className="text-xs">
        <p className="font-semibold text-white">{toast.title}</p>
        {toast.message && <p className="text-slate-400 mt-0.5">{toast.message}</p>}
      </div>
      <button
        onClick={onClose}
        className="ml-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
