import React from 'react';
import { StatusLevel } from '@/lib/types';

interface StatusPanelProps {
  status: StatusLevel;
  riskFactor: number;
}

export default function StatusPanel({ status, riskFactor }: StatusPanelProps) {
  let statusColor = 'text-primary';
  let borderColor = 'border-primary';
  let barColor = 'bg-primary';

  if (status === 'WARNING') {
    statusColor = 'text-secondary';
    borderColor = 'border-secondary';
    barColor = 'bg-secondary';
  } else if (status === 'CRITICAL') {
    statusColor = 'text-error';
    borderColor = 'border-error';
    barColor = 'bg-error';
  }

  return (
    <div className={`lg:col-span-4 bg-surface-container-high p-8 flex flex-col justify-center border-l-4 ${borderColor}`}>
      <div>
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-1">
          Environmental Status
        </p>
        <h1 className={`text-7xl font-black font-space tracking-tighter ${statusColor}`}>
          {status}
        </h1>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-[10px] uppercase font-bold text-on-surface-variant mb-1">
          <span>Risk Factor</span>
          <span>{Math.round(riskFactor)}%</span>
        </div>
        <div className="h-1 bg-surface-container-lowest overflow-hidden">
          <div 
            className={`h-full ${barColor} transition-all duration-500 ease-out`} 
            style={{ width: `${riskFactor}%` }}
          />
        </div>
      </div>
    </div>
  );
}
