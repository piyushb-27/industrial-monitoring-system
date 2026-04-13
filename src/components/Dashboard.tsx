'use client';
import React, { useEffect, useState, useRef } from 'react';
import { PlatformState, TelemetryData, StatusLevel } from '@/lib/types';
import StatusPanel from './StatusPanel';
import SensorCard from './SensorCard';
import ChartSection from './ChartSection';
import IncidentPanel from './IncidentPanel';

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

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#0c0e10] flex justify-between items-center px-4 md:px-8 h-16 border-b border-outline-variant/10">
        <div className="flex items-center gap-4 md:gap-8 truncate mr-2">
          <span className="text-sm md:text-xl font-bold tracking-tighter text-[#00daf3] font-space truncate">
            <span className="hidden sm:inline">INDUSTRIAL SAFETY MONITORING SYSTEM</span>
            <span className="sm:hidden">SAFETY MONITOR</span>
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-surface-container rounded-lg border border-outline-variant/20">
            <span className={`w-2 h-2 rounded-full ${state.connected ? 'bg-primary animate-pulse' : 'bg-error'}`}></span>
            <span className={`hidden md:inline text-[10px] font-bold ${state.connected ? 'text-primary' : 'text-error'} font-space tracking-widest uppercase`}>
              {state.connected ? 'Connected to ThingSpeak' : 'Disconnected'}
            </span>
          </div>
          <img 
            alt="Operator" 
            className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-primary/30" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRJZsbMl-VeZy03kEwgp4hw6oJKaX9wF-7pj1yrcYfQpmSerg7p1REbS81fVIGJbjIwN1IPKdajpzKsd-gX4bKRrn8qSLBOG6awsyK1_x5rJrC59F2veCmAvuSQZLPtOPLsfSDThbsYyHJWuz36xVSk4h7JqUrJ02d0GX_HdK9Mjk23-F_0ZnRIInVdeaIWSxcVnkMtKDMWa6xQUPTk2m88zkcgtiEXaDoDBW_JX-ZwINzky1-dCOSA5BkPPbZKs_ue9oyqPE-AAsG"
          />
        </div>
      </nav>

      <main className="mt-16 px-4 py-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <StatusPanel status={state.status} riskFactor={riskFactor} />
          
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <SensorCard 
              title="Temperature"
              icon="thermostat"
              value={state.temperature.toFixed(1)}
              unit="°C"
              iconColorClass="text-primary-dim"
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
              borderColorClass={`border-b-2 ${state.status === 'SAFE' ? 'border-secondary' : state.status === 'WARNING' ? 'border-secondary' : 'border-error'} bg-surface-container`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <ChartSection data={state.feeds} />
          <IncidentPanel onManualAlert={() => triggerAlert("MANUAL EMERGENCY OVERRIDE INITIATED", true)} />
        </div>
        
        {state.lastUpdated && (
          <div className="text-right text-[10px] text-on-surface-variant/50 uppercase tracking-widest mt-4">
            Last Updated: {new Date(state.lastUpdated).toLocaleString()}
          </div>
        )}
      </main>
    </>
  );
}
