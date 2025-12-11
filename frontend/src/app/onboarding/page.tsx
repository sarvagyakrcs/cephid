'use client';

import { useState, useTransition } from 'react';
import { registerUser } from '@/actions/grpc/index';
import type { RegisterResponse } from '@/generated/onboarding';

export default function OnboardingPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<RegisterResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRegister = () => {
    setError(null);
    setResult(null);

    if (!username || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    startTransition(async () => {
      try {
        const response = await registerUser(username, email, password);
        setResult(response);
        if (response.success) {
          setUsername('');
          setEmail('');
          setPassword('');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    });
  };

  const inputClassName = "w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      {/* Subtle grid background */}
      <div 
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      
      <div className="relative w-full max-w-lg">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-violet-500/20 rounded-2xl blur-xl opacity-60" />
        
        <div className="relative bg-[#111111] border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-3 h-3 rounded-full bg-violet-400 animate-pulse" />
            <h1 className="text-2xl font-light tracking-wide">
              User <span className="text-violet-400 font-medium">Registration</span>
            </h1>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/40">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                className={inputClassName}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/40">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className={inputClassName}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/40">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClassName}
                onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
              />
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleRegister}
            disabled={isPending}
            className="w-full mt-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-white/10 disabled:to-white/10 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 disabled:shadow-none"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Registering...
              </span>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Success Response */}
          {result?.success && (
            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="text-xs uppercase tracking-widest text-emerald-400/60 mb-2">
                Success
              </div>
              <div className="text-emerald-300 text-sm mb-2">
                {result.message}
              </div>
              {result.userId && (
                <div className="text-emerald-400/70 font-mono text-xs break-all">
                  User ID: {result.userId}
                </div>
              )}
            </div>
          )}

          {/* Failed Response */}
          {result && !result.success && (
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="text-xs uppercase tracking-widest text-amber-400/60 mb-1">
                Registration Failed
              </div>
              <div className="text-amber-300 text-sm">
                {result.message}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="text-xs uppercase tracking-widest text-red-400/60 mb-1">
                Error
              </div>
              <div className="text-red-300 font-mono text-sm break-all">
                {error}
              </div>
            </div>
          )}

          {/* Status indicator */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-white/30">
            <span>localhost:9090</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              gRPC Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
