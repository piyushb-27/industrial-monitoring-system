import React from 'react';

interface SensorCardProps {
  title: string;
  icon: string;
  value: number | string;
  unit: string;
  iconColorClass?: string;
  borderColorClass?: string;
}

export default function SensorCard({ 
  title, 
  icon, 
  value, 
  unit, 
  iconColorClass = 'text-primary',
  borderColorClass = 'border-white/10'
}: SensorCardProps) {
  return (
    <div className={`glass-card p-6 flex flex-col justify-between rounded-3xl border ${borderColorClass} group transition-all duration-300 hover:-translate-y-1 hover:bg-white/5 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]`}>
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 group-hover:bg-white/10 transition-colors ${iconColorClass}`}>
          <span className="material-symbols-outlined text-3xl">
            {icon}
          </span>
        </div>
      </div>

      <div className="mt-6 relative z-10">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.15em] mb-1">
          {title}
        </p>
        <div className="flex items-baseline gap-1">
          <span className={`text-5xl font-black font-space tracking-tighter ${iconColorClass}`}>
            {value}
          </span>
          <span className="text-sm font-bold text-on-surface-variant">
            {unit}
          </span>
        </div>
      </div>
      
      {/* Decorative background glow for hover state */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full mix-blend-screen filter blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none ${iconColorClass.replace('text-', 'bg-')}`}></div>
    </div>
  );
}
