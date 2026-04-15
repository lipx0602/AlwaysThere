export interface DayVitals {
  date: string;
  heartRate: number; // bpm
  hrv: number;       // ms
  spo2: number;      // %
  temp: number;      // °F
  systolic: number;
  diastolic: number;
}

export const VITALS_LAST_7_DAYS: DayVitals[] = [
  { date: 'Mon', heartRate: 72,  hrv: 48, spo2: 97, temp: 98.2, systolic: 118, diastolic: 76 },
  { date: 'Tue', heartRate: 88,  hrv: 42, spo2: 96, temp: 98.6, systolic: 122, diastolic: 80 },
  { date: 'Wed', heartRate: 65,  hrv: 55, spo2: 98, temp: 97.9, systolic: 115, diastolic: 74 },
  { date: 'Thu', heartRate: 95,  hrv: 38, spo2: 96, temp: 99.1, systolic: 128, diastolic: 84 },
  { date: 'Fri', heartRate: 78,  hrv: 50, spo2: 97, temp: 98.4, systolic: 120, diastolic: 78 },
  { date: 'Sat', heartRate: 110, hrv: 28, spo2: 95, temp: 99.4, systolic: 135, diastolic: 88 },
  { date: 'Sun', heartRate: 82,  hrv: 46, spo2: 97, temp: 98.1, systolic: 119, diastolic: 77 },
];

export const DUMMY_ALERTS = [
  { icon: '❤️', message: 'Heart rate spike at 11:42 PM', time: 'Last night' },
  { icon: '🚶', message: 'Unusual inactivity detected at 3:10 PM', time: 'Yesterday' },
  { icon: '🌡️', message: 'Elevated temperature at 7:55 AM', time: 'Yesterday' },
];
