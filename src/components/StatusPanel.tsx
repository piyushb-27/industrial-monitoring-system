import React from 'react';
import { StatusLevel } from '@/lib/types';

interface StatusPanelProps {
  status: StatusLevel;
  riskFactor: number;
}

export default function StatusPanel({ status, riskFactor }: StatusPanelProps) {
  let statusColor = 'text-primary';
  let borderColor = 'border-primary shadow-[0_0_30px_rgba(0,218,243,0.15)]';
  let barColor = 'bg-primary shadow-[0_0_10px_#00daf3]';

  if (status === 'WARNING') {
    statusColor = 'text-secondary';
    borderColor = 'border-secondary shadow-[0_0_30px_rgba(254,179,0,0.15)]';
    barColor = 'bg-secondary shadow-[0_0_10px_#feb300]';
  } else if (status === 'CRITICAL') {
    statusColor = 'text-error';
    borderColor = 'border-error shadow-[0_0_30px_rgba(238,125,119,0.25)]';
    barColor = 'bg-error shadow-[0_0_10px_#ee7d77]';
  }

  return (
    <div className={`lg:col-span-4 glass-card p-8 flex flex-col justify-center border border-white/10 rounded-3xl ${borderColor} transition-all duration-500 hover:scale-[1.01] group`}>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className={`material-symbols-outlined ${statusColor.split(' ')[0]} animate-pulse`}>
            {status === 'SAFE' ? 'check_circle' : status === 'WARNING' ? 'warning' : 'dangerous'}
          </span>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em]">
            Environmental Status
          </p>
        </div>
        <h1 className={`text-6xl md:text-7xl font-black font-space tracking-tighter ${statusColor} transition-all duration-500`}>
          {status}
        </h1>
      </div>

      <div className="mt-8">
        <div className="flex justify-between text-[10px] uppercase font-bold text-on-surface-variant mb-2">
          <span className="tracking-widest">Risk Factor</span>
          <span className="text-white">{Math.round(riskFactor)}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
          <div 
            className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`} 
            style={{ width: `${riskFactor}%` }}
          >
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
