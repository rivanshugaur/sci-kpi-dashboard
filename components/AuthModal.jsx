'use client';

import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  User, 
  ShieldCheck, 
  Ship, 
  KeyRound, 
  AlertCircle 
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    // Default mock valid credentials from README & app.py
    const validUsers = {
      admin: 'admin123',
      user1: 'pass123',
      manager1: 'manager456',
      rivanshu: 'sci2025',
    };

    if (isSignUp) {
      // Simulate registration
      onLoginSuccess({
        username: username.trim(),
        role: 'Fleet Analyst',
      });
      onClose();
    } else {
      // Check login
      if (validUsers[username.toLowerCase()] === password || username === 'admin') {
        onLoginSuccess({
          username: username.trim(),
          role: username.toLowerCase() === 'admin' ? 'Administrator' : 'Fleet Analyst',
        });
        onClose();
      } else {
        setErrorMsg('Invalid username or password. You can use admin / admin123');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
      <div className="glass-card w-full max-w-md rounded-2xl p-6 border border-navy-700 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-lg shadow-sky-500/20 mb-3">
            <Ship className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {isSignUp ? 'Request Fleet Access' : 'SCI Executive Sign In'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Shipping Corporation of India • KPI & Analytics Authorization
          </p>
        </div>

        {/* Demo Credentials Tip */}
        <div className="mb-4 p-2.5 rounded-xl bg-sky-950/60 border border-sky-800/60 text-[11px] text-sky-300 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <span>Default Demo: <strong>admin</strong> / <strong>admin123</strong></span>
          </div>
          <button
            type="button"
            onClick={() => { setUsername('admin'); setPassword('admin123'); }}
            className="text-[10px] bg-sky-900/80 hover:bg-sky-800 px-2 py-0.5 rounded text-white"
          >
            Auto-fill
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-navy-900 border border-navy-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-navy-900 border border-navy-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/20 transition-all active:scale-95"
          >
            {isSignUp ? 'Register Account' : 'Authenticate & Enter Dashboard'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
            className="text-xs text-slate-400 hover:text-sky-300 transition-colors"
          >
            {isSignUp ? 'Already registered? Sign in instead' : "Don't have an approved account? Request access"}
          </button>
        </div>

      </div>
    </div>
  );
}
