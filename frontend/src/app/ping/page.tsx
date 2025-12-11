'use client';

import { useState, useTransition } from 'react';
import { pingServer } from '@/actions/grpc/index';

export default function PingPage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handlePing = () => {
    setError(null);
    setResponse(null);
    
    startTransition(async () => {
      try {
        const result = await pingServer(message || 'Hello from client!');
        setResponse(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      {/* Subtle grid background */}
      <div 
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      <div className="relative w-full max-w-lg">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-60" />
        
        <div className="relative bg-[#111111] border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-2xl font-light tracking-wide">
              gRPC <span className="text-emerald-400 font-medium">Ping</span>
            </h1>
          </div>

          {/* Input */}
          <div className="space-y-2 mb-6">
            <label className="text-xs uppercase tracking-widest text-white/40">
              Message
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hello from client!"
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 
                       text-white placeholder:text-white/20
                       focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                       transition-all duration-200"
              onKeyDown={(e) => e.key === 'Enter' && handlePing()}
            />
          </div>

          {/* Button */}
          <button
            onClick={handlePing}
            disabled={isPending}
            className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 
                     hover:from-emerald-500 hover:to-cyan-500
                     disabled:from-white/10 disabled:to-white/10 disabled:cursor-not-allowed
                     text-white font-medium py-3 px-6 rounded-lg
                     transition-all duration-200 
                     shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40
                     disabled:shadow-none"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Pinging...
              </span>
            ) : (
              'Send Ping'
            )}
          </button>

          {/* Response */}
          {response && (
            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="text-xs uppercase tracking-widest text-emerald-400/60 mb-1">
                Response
              </div>
              <div className="text-emerald-300 font-mono text-sm break-all">
                {response}
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
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              gRPC Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

