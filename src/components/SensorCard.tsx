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
  iconColorClass = 'text-primary-dim',
  borderColorClass = 'border-outline-variant/10 border'
}: SensorCardProps) {
  return (
    <div className={`bg-surface-container p-6 flex flex-col justify-between ${borderColorClass}`}>
      <div className="flex justify-between items-start">
        <span className={`material-symbols-outlined ${iconColorClass}`}>
          {icon}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          {title}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black font-space">
            {value}
          </span>
          <span className="text-sm font-medium text-on-surface-variant">
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
}
