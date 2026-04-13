export type StatusLevel = 'SAFE' | 'WARNING' | 'CRITICAL';

export interface TelemetryData {
  created_at: string;
  field1: string; // Temperature
  field2: string; // Humidity
  field3: string; // Gas Level (raw)
  [key: string]: string | number;
}

export interface PlatformState {
  temperature: number;
  humidity: number;
  gas: number;
  status: StatusLevel;
  lastUpdated: string | null;
  connected: boolean;
  feeds: TelemetryData[];
}
