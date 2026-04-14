'use client';
import React, { useEffect, useState, useRef } from 'react';
import { PlatformState, TelemetryData, StatusLevel } from '@/lib/types';
import StatusPanel from './StatusPanel';
import SensorCard from './SensorCard';
import ChartSection from './ChartSection';

export default function Dashboard() {
  const [state, setState] = useState<PlatformState>({
    temperature: 0,
    humidity: 0,
    gas: 0,
    status: 'SAFE',
    lastUpdated: null,
    connected: false,
    feeds: [],
  });

  const lastAlertTime = useRef<number>(0);
  const ALERT_COOLDOWN_MS = 60000; // 1 minute

  const triggerAlert = (reason: string, force: boolean = false) => {
    const now = Date.now();
    if (force || now - lastAlertTime.current > ALERT_COOLDOWN_MS) {
      lastAlertTime.current = now;

      // Play audio alarm
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/940/940-preview.mp3'); // Loud warning siren
      audio.play().catch(e => console.log('Audio blocked by browser:', e));

      // Show Desktop Notification
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("CRITICAL SAFETY ALERT", { body: reason });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              new Notification("CRITICAL SAFETY ALERT", { body: reason });
            }
          });
        }
      }
    }
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const fetchData = async () => {
    try {
      const channelId = process.env.NEXT_PUBLIC_THINGSPEAK_CHANNEL_ID || '';
      const apiKey = process.env.NEXT_PUBLIC_THINGSPEAK_READ_API_KEY || '';
      
      const response = await fetch(
        `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=20`
      );
      if (!response.ok) throw new Error('API Response not ok');
      const data = await response.json();
      
      const feeds: TelemetryData[] = data.feeds || [];
      if (feeds.length > 0) {
        const latestInfo = feeds[feeds.length - 1];
        
        const temp = parseFloat(latestInfo.field1) || 0;
        const hum = parseFloat(latestInfo.field2) || 0;
        const gasLvl = parseFloat(latestInfo.field3) || 0;
        
        let newStatus: StatusLevel = 'SAFE';
        if (gasLvl > 2400 || temp > 70) {
          newStatus = 'CRITICAL';
          triggerAlert(`Threshold exceeded! Temp: ${temp} C, Gas: ${gasLvl}`);
        } else if (gasLvl > 1800 || temp > 50) {
          newStatus = 'WARNING';
        }

        const latestTime = new Date(latestInfo.created_at).getTime();
        const now = Date.now();
        const isConnected = (now - latestTime) < 60000; // 60s threshold

        setState(prev => ({
          ...prev,
          temperature: temp,
          humidity: hum,
          gas: gasLvl,
          status: newStatus,
          lastUpdated: latestInfo.created_at,
          connected: isConnected,
          feeds: feeds
        }));
      }
    } catch (err) {
      console.error('Failed to fetch ThingSpeak data:', err);
      setState(prev => ({ ...prev, connected: false }));
    }
  };

  useEffect(() => {
    fetchData(); // initial fetch
    const interval = setInterval(() => {
      fetchData();
    }, 4000); // 4s updates

    return () => clearInterval(interval);
  }, []);

  // Compute risk factor out of 100 (assuming 3000 gas as absolute max risk, adjust as needed)
  const riskFactor = Math.min((state.gas / 3000) * 100, 100);

  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dashboardRef.current) {
      const rect = dashboardRef.current.getBoundingClientRect();
      dashboardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      dashboardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    }
  };

  return (
    <div 
      ref={dashboardRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#13171a] relative overflow-hidden"
    >
      {/* Interactive Hover Glow Background */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
        style={{
          background: 'radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, -20%), rgba(0, 218, 243, 0.25), transparent 40%)'
        }}
      />

      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 glass-panel rounded-2xl flex justify-between items-center px-4 md:px-8 h-16 transition-all duration-300">
        <div className="flex items-center gap-4 md:gap-8 mr-2 group">
          <span className="text-sm md:text-xl font-bold tracking-tighter text-primary font-space">
            <span className="hidden sm:inline">INDUSTRIAL SAFETY MONITORING SYSTEM</span>
            <span className="sm:hidden">SAFETY MONITOR</span>
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => triggerAlert("MANUAL EMERGENCY OVERRIDE INITIATED", true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-black text-[10px] tracking-widest rounded-xl transition-all shadow-[0_4px_10px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(239,68,68,0.9)] group"
          >
            <span className="material-symbols-outlined text-sm">campaign</span>
            <span className="hidden md:inline transition-all">EMERGENCY ALERT</span>
          </button>
          
          <div className="hidden md:flex items-center gap-2 px-3 justify-center py-1.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 shadow-inner group">
            <span className={`w-2 h-2 rounded-full ${state.connected ? 'bg-primary shadow-[0_0_10px_#00daf3] animate-pulse' : 'bg-error shadow-[0_0_10px_#ee7d77]'}`}></span>
            <span className={`text-[10px] font-bold ${state.connected ? 'text-primary' : 'text-error'} font-space tracking-widest uppercase transition-all`}>
              {state.connected ? 'LIVE CONNECTION' : 'DISCONNECTED'}
            </span>
          </div>
          <img 
            alt="Operator" 
            className="w-8 h-8 rounded-full border-2 border-primary/40 shadow-[0_0_15px_rgba(0,218,243,0.3)] hover:shadow-[0_0_25px_rgba(0,218,243,0.8)] transition-all" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRJZsbMl-VeZy03kEwgp4hw6oJKaX9wF-7pj1yrcYfQpmSerg7p1REbS81fVIGJbjIwN1IPKdajpzKsd-gX4bKRrn8qSLBOG6awsyK1_x5rJrC59F2veCmAvuSQZLPtOPLsfSDThbsYyHJWuz36xVSk4h7JqUrJ02d0GX_HdK9Mjk23-F_0ZnRIInVdeaIWSxcVnkMtKDMWa6xQUPTk2m88zkcgtiEXaDoDBW_JX-ZwINzky1-dCOSA5BkPPbZKs_ue9oyqPE-AAsG"
          />
        </div>
      </nav>

      <main className="relative z-10 pt-28 px-4 pb-12 md:px-8 max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          <StatusPanel status={state.status} riskFactor={riskFactor} />
          
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 h-full">
            <SensorCard 
              title="Temperature"
              icon="thermostat"
              value={state.temperature.toFixed(1)}
              unit="°C"
              iconColorClass="text-primary"
            />
            <SensorCard 
              title="Humidity"
              icon="humidity_percentage"
              value={state.humidity.toFixed(1)}
              unit="%"
              iconColorClass="text-primary-dim"
            />
            <SensorCard 
              title="Gas Level"
              icon="co2"
              value={state.gas.toFixed(0)}
              unit=""
              iconColorClass={state.status === 'SAFE' ? 'text-secondary' : state.status === 'WARNING' ? 'text-secondary' : 'text-error'}
              borderColorClass={state.status === 'SAFE' ? 'border-secondary/30' : state.status === 'WARNING' ? 'border-secondary' : 'border-error shadow-[0_0_20px_rgba(238,125,119,0.3)]'}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-8">
          <ChartSection data={state.feeds} />
        </div>
        
        {state.lastUpdated && (
          <div className="text-right text-xs text-on-surface-variant/40 font-bold uppercase tracking-widest mt-4">
            Last Updated: <span className="text-primary/70">{new Date(state.lastUpdated).toLocaleString()}</span>
          </div>
        )}
      </main>
    </div>
  );
}
