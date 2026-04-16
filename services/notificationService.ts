import * as Notifications from 'expo-notifications';

import { type NotificationRule, type VitalCondition } from '@/constants/notificationRules';
import { type DayVitals } from '@/constants/vitals';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

function checkCondition(vitals: DayVitals, condition: VitalCondition): boolean {
  const value = vitals[condition.field as keyof DayVitals] as number;
  switch (condition.operator) {
    case '>':  return value > condition.threshold;
    case '<':  return value < condition.threshold;
    case '>=': return value >= condition.threshold;
    case '<=': return value <= condition.threshold;
  }
}

function ruleMatches(vitals: DayVitals, rule: NotificationRule): boolean {
  if (rule.conditionOperator === 'AND') {
    return rule.conditions.every(c => checkCondition(vitals, c));
  }
  return rule.conditions.some(c => checkCondition(vitals, c));
}

export async function scheduleRuleNotifications(rule: NotificationRule): Promise<void> {
  for (const step of rule.steps) {
    const content: Notifications.NotificationContentInput = {
      title: step.title,
      body: step.body,
      sound: true,
      data: step.deepLink ? { deepLink: step.deepLink, ruleId: rule.id } : { ruleId: rule.id },
    };

    if (step.delaySeconds === 0) {
      await Notifications.scheduleNotificationAsync({
        content,
        trigger: null, // fire immediately
      });
    } else {
      await Notifications.scheduleNotificationAsync({
        content,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: step.delaySeconds,
          repeats: false,
        },
      });
    }
  }
}

export async function scheduleEmergencyNotification(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Please seek help right now',
      body: "We're with you. Please call emergency services or ask someone nearby for assistance. Your health comes first.",
      sound: true,
      data: { ruleId: 'emergency' },
    },
    trigger: null,
  });
}

export async function cancelAllRuleNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export function evaluateRules(
  vitals: DayVitals,
  rules: NotificationRule[]
): NotificationRule[] {
  return rules.filter(rule => ruleMatches(vitals, rule));
}
