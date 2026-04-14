'use client';
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TelemetryData } from '@/lib/types';

interface ChartSectionProps {
  data: TelemetryData[];
}

export default function ChartSection({ data }: ChartSectionProps) {
  // Parse data for Recharts, ensure chronologically sorted if needed
  const chartData = data.map((d) => ({
    time: new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    temperature: parseFloat(d.field1) || 0,
    gas: parseFloat(d.field3) || 0
  }));

  return (
    <div className="glass-card p-6 md:p-8 flex flex-col border border-white/10 rounded-3xl relative gap-6 md:gap-8 transition-all hover:bg-white/5 group">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary text-xl">analytics</span>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">
              Live Telemetry Analysis
            </h3>
          </div>
          <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-[0.2em]">
            Real-time sensor streams
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 w-full h-[600px] md:h-[500px]">
        {/* Temperature Chart */}
        <div className="flex-1 w-full relative bg-black/20 rounded-2xl p-4 border border-white/5 shadow-inner">
          <div className="absolute top-4 left-6 z-10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#00daf3]"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Temperature (°C)</span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} vertical={false} />
              <XAxis dataKey="time" stroke="#a6acb3" fontSize={10} tick={{fill: '#a6acb3'}} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" stroke="#00daf3" fontSize={10} tick={{fill: '#00daf3'}} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
                itemStyle={{ color: '#00daf3', fontWeight: 'bold' }} 
              />
              <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#00daf3" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#00daf3', stroke: '#fff', strokeWidth: 2 }} isAnimationActive={true} style={{ filter: 'drop-shadow(0px 0px 8px rgba(0, 218, 243, 0.4))' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gas Chart */}
        <div className="flex-1 w-full relative bg-black/20 rounded-2xl p-4 border border-white/5 shadow-inner">
          <div className="absolute top-4 left-6 z-10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#feb300]"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Gas Level (Raw)</span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} vertical={false} />
              <XAxis dataKey="time" stroke="#a6acb3" fontSize={10} tick={{fill: '#a6acb3'}} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" stroke="#feb300" fontSize={10} tick={{fill: '#feb300'}} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
                itemStyle={{ color: '#feb300', fontWeight: 'bold' }} 
              />
              <Line yAxisId="right" type="monotone" dataKey="gas" stroke="#feb300" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#feb300', stroke: '#fff', strokeWidth: 2 }} isAnimationActive={true} style={{ filter: 'drop-shadow(0px 0px 8px rgba(254, 179, 0, 0.4))' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
