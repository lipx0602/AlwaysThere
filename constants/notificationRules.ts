export type VitalField = 'hrv' | 'systolic' | 'diastolic' | 'heartRate' | 'spo2' | 'temp';
export type Operator = '>' | '<' | '>=' | '<=';

export interface VitalCondition {
  field: VitalField;
  operator: Operator;
  threshold: number;
}

export interface NotificationStep {
  delaySeconds: number;
  title: string;
  body: string;
  deepLink?: string;
}

export interface NotificationRule {
  id: string;
  name: string;
  conditions: VitalCondition[];
  conditionOperator: 'AND' | 'OR';
  steps: NotificationStep[];
  cooldownMinutes: number;
}

export const NOTIFICATION_RULES: NotificationRule[] = [
  {
    id: 'bp_hrv_high',
    name: 'High Blood Pressure & Elevated HRV',
    conditions: [
      { field: 'systolic', operator: '>=', threshold: 140 },
      { field: 'hrv', operator: '>=', threshold: 50 },
    ],
    conditionOperator: 'AND',
    cooldownMinutes: 60,
    steps: [
      {
        delaySeconds: 5,
        title: '🚨 Sit down & check your BP',
        body: 'Your readings look high. Please sit, rest, and take a blood pressure reading now.',
        deepLink: '/alert-rest',
      },
      {
        delaySeconds: 15,
        title: '💛 How are you feeling?',
        body: 'Tap to tell us your blood pressure reading.',
        deepLink: '/alert-response?ruleId=bp_hrv_high',
      },
    ],
  },
];
