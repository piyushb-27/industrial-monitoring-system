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
    <div className="lg:col-span-3 bg-surface-container-high p-6 flex flex-col border border-outline-variant/10 relative gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-on-surface">
            Live Telemetry Analysis
          </h3>
          <p className="text-[10px] text-on-surface-variant font-medium uppercase mt-1">
            Real-time data streams
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full h-[500px]">
        {/* Temperature Chart */}
        <div className="flex-1 w-full relative chart-grid border border-outline-variant/5">
          <div className="absolute top-2 left-6 z-10 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary"></span>
            <span className="text-[10px] font-bold uppercase text-on-surface-variant">Temperature (°C)</span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 30, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#42494f" opacity={0.2} vertical={false} />
              <XAxis dataKey="time" stroke="#a6acb3" fontSize={10} tick={{fill: '#a6acb3'}} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" stroke="#00daf3" fontSize={10} tick={{fill: '#00daf3'}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1b2025', borderColor: '#42494f', color: '#e0e6ed', fontSize: '12px' }} itemStyle={{ color: '#00daf3' }} />
              <Line yAxisId="left" type="natural" dataKey="temperature" stroke="#00daf3" strokeWidth={2} dot={{ r: 2, fill: '#00daf3' }} activeDot={{ r: 4 }} isAnimationActive={true} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gas Chart */}
        <div className="flex-1 w-full relative chart-grid border border-outline-variant/5">
          <div className="absolute top-2 left-6 z-10 flex items-center gap-2">
            <span className="w-2 h-2 bg-secondary"></span>
            <span className="text-[10px] font-bold uppercase text-on-surface-variant">Gas Level (Raw)</span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 30, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#42494f" opacity={0.2} vertical={false} />
              <XAxis dataKey="time" stroke="#a6acb3" fontSize={10} tick={{fill: '#a6acb3'}} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" stroke="#feb300" fontSize={10} tick={{fill: '#feb300'}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1b2025', borderColor: '#42494f', color: '#e0e6ed', fontSize: '12px' }} itemStyle={{ color: '#feb300' }} />
              <Line yAxisId="right" type="natural" dataKey="gas" stroke="#feb300" strokeWidth={2} dot={{ r: 2, fill: '#feb300' }} activeDot={{ r: 4 }} isAnimationActive={true} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
