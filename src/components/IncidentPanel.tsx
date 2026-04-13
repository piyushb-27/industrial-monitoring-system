'use client';
import React from 'react';

interface IncidentPanelProps {
  onManualAlert: () => void;
}

export default function IncidentPanel({ onManualAlert }: IncidentPanelProps) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-tertiary-container/10 border border-tertiary-container/30 p-6 h-full flex flex-col justify-between min-h-[300px]">
        <div>
          <div className="flex items-center gap-2 text-tertiary mb-4">
            <span className="material-symbols-outlined">report_problem</span>
            <h3 className="text-xs font-black uppercase tracking-widest">
              Incident Control
            </h3>
          </div>
          <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
            Emergency manual override protocol for immediate hazard mitigation.
          </p>
        </div>

        <div>
          <button 
            onClick={onManualAlert}
            className="w-full bg-tertiary py-5 rounded text-on-tertiary font-black text-xs tracking-tighter hover:bg-tertiary-dim active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">sms</span>
            SEND EMERGENCY ALERT (SMS)
          </button>
        </div>
      </div>
    </div>
  );
}
