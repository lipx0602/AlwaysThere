import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { NOTIFICATION_RULES } from '@/constants/notificationRules';
import { Brand, Guardian } from '@/constants/theme';
import { DUMMY_ALERTS, VITALS_LAST_7_DAYS } from '@/constants/vitals';
import { useOnboarding } from '@/context/OnboardingContext';
import {
  evaluateRules,
  scheduleGuardianNotifications,
  scheduleRuleNotifications,
} from '@/services/notificationService';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_OUTER_WIDTH = SCREEN_WIDTH - 32; // card horizontal padding
const CHART_INNER_WIDTH = CHART_OUTER_WIDTH - 32; // inner card padding
const CHART_HEIGHT = 200;

// Normal band (60–100 bpm) pixel offsets
// Y axis: min=40, max=120 → range=80
// Plot area height ≈ CHART_HEIGHT - 64 (top + bottom padding in chart-kit)
const Y_MIN = 40;
const Y_MAX = 120;
const Y_RANGE = Y_MAX - Y_MIN;
const PLOT_HEIGHT = CHART_HEIGHT - 64;
const CHART_TOP_PADDING = 36;
const CHART_LEFT_OFFSET = 58; // y-axis label area width

const BAND_TOP = CHART_TOP_PADDING + ((Y_MAX - 100) / Y_RANGE) * PLOT_HEIGHT;
const BAND_HEIGHT = ((100 - 60) / Y_RANGE) * PLOT_HEIGHT;

const chartData = {
  labels: VITALS_LAST_7_DAYS.map(d => d.date),
  datasets: [
    {
      data: VITALS_LAST_7_DAYS.map(d => d.heartRate),
      strokeWidth: 2,
    },
  ],
};

const chartConfig = {
  backgroundColor: Brand.surface,
  backgroundGradientFrom: Brand.surface,
  backgroundGradientTo: Brand.surface,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(249, 115, 22, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
  style: { borderRadius: 8 },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: Brand.primary,
  },
  propsForBackgroundLines: {
    stroke: Brand.border,
    strokeDasharray: '',
  },
};

// Demo vitals that trigger the bp_hrv_high rule
const DEMO_HIGH_VITALS = {
  date: 'Now',
  heartRate: 98,
  hrv: 52,
  spo2: 96,
  temp: 99.1,
  systolic: 145,
  diastolic: 92,
};

// ─── Guardian / Family Caregiver Home ───────────────────────────────────────

const GUARDIAN_TIMELINE = [
  { icon: '🩸', message: 'Blood pressure reading sent to you', time: '2:34 PM', level: 'warning' },
  { icon: '💓', message: 'Heart rate returned to normal range', time: '2:50 PM', level: 'ok' },
  { icon: '😴', message: 'Rest period detected — no readings', time: '3:30 PM', level: 'ok' },
  { icon: '✅', message: 'Evening check-in completed', time: '6:00 PM', level: 'ok' },
];

function CaregiverHome() {
  const [simulating, setSimulating] = useState(false);
  const [simulated, setSimulated] = useState(false);

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const matched = evaluateRules(DEMO_HIGH_VITALS, NOTIFICATION_RULES);
      for (const rule of matched) {
        await scheduleGuardianNotifications(rule);
      }
      setSimulated(true);
    } finally {
      setSimulating(false);
    }
  };

  const latestVitals = VITALS_LAST_7_DAYS[6];
  const bpHigh = latestVitals.systolic >= 140;
  const statusOk = !bpHigh;

  return (
    <SafeAreaView style={gStyles.safe}>
      <ScrollView
        style={gStyles.scroll}
        contentContainerStyle={gStyles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={gStyles.headerRow}>
          <View>
            <Text style={gStyles.greeting}>Checking in on</Text>
            <Text style={gStyles.appName}>Your Loved One</Text>
          </View>
          <View style={gStyles.shieldBadge}>
            <Ionicons name="people" size={22} color={Guardian.primary} />
          </View>
        </View>

        {/* Wellbeing status banner */}
        <View style={[gStyles.statusBanner, statusOk ? gStyles.statusBannerOk : gStyles.statusBannerWarn]}>
          <Ionicons
            name={statusOk ? 'checkmark-circle' : 'alert-circle'}
            size={22}
            color={statusOk ? Guardian.primary : '#D97706'}
          />
          <View style={gStyles.statusText}>
            <Text style={[gStyles.statusTitle, !statusOk && gStyles.statusTitleWarn]}>
              {statusOk ? 'Doing well today' : 'Needs your attention'}
            </Text>
            <Text style={gStyles.statusSub}>
              {statusOk
                ? 'All readings are within a comfortable range.'
                : 'Blood pressure was elevated earlier. Consider calling to check in.'}
            </Text>
          </View>
        </View>

        {/* Alert simulation card */}
        <View style={gStyles.card}>
          <View style={gStyles.cardHeader}>
            <Ionicons name="notifications" size={18} color={Guardian.primary} />
            <Text style={gStyles.cardTitle}>Your Alerts</Text>
          </View>
          <Text style={gStyles.cardSub}>Notifications you receive when something needs attention</Text>
          <View style={gStyles.divider} />

          {simulated ? (
            <View style={gStyles.demoTip}>
              <Ionicons name="information-circle" size={18} color={Guardian.primary} style={{ marginTop: 1 }} />
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={gStyles.demoTipText}>
                  <Text style={gStyles.demoTipBold}>This is a demo. </Text>
                  Exit the app — you'll receive a family alert shortly, then a follow-up 40 seconds later.
                </Text>
                <TouchableOpacity onPress={() => setSimulated(false)} activeOpacity={0.7}>
                  <Text style={gStyles.demoTipRetry}>Simulate again</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[gStyles.simulateBtn, simulating && gStyles.simulateBtnDisabled]}
              onPress={handleSimulate}
              disabled={simulating}
              activeOpacity={0.8}
            >
              {simulating ? (
                <ActivityIndicator size="small" color={Guardian.primary} />
              ) : (
                <>
                  <Ionicons name="notifications-outline" size={15} color={Guardian.primary} />
                  <Text style={gStyles.simulateBtnText}>Simulate family alert</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Activity timeline */}
        <View style={gStyles.card}>
          <View style={gStyles.cardHeader}>
            <Ionicons name="time" size={18} color={Guardian.primary} />
            <Text style={gStyles.cardTitle}>Yesterday's Activity</Text>
          </View>
          <View style={gStyles.divider} />
          {GUARDIAN_TIMELINE.map((item, i) => (
            <View
              key={i}
              style={[gStyles.timelineRow, i < GUARDIAN_TIMELINE.length - 1 && gStyles.timelineRowBorder]}
            >
              <Text style={gStyles.timelineIcon}>{item.icon}</Text>
              <View style={gStyles.timelineContent}>
                <Text style={gStyles.timelineMsg}>{item.message}</Text>
                <Text style={gStyles.timelineTime}>{item.time}</Text>
              </View>
              <View style={[gStyles.dot, item.level === 'ok' ? gStyles.dotOk : gStyles.dotWarn]} />
            </View>
          ))}
        </View>

        {/* Gentle vitals snapshot */}
        <View style={gStyles.card}>
          <View style={gStyles.cardHeader}>
            <Ionicons name="heart" size={18} color={Guardian.primary} />
            <Text style={gStyles.cardTitle}>Last Known Readings</Text>
          </View>
          <Text style={gStyles.cardSub}>From the most recent sync</Text>
          <View style={gStyles.vitalsGrid}>
            {[
              {
                label: 'Heart Rate',
                value: `${latestVitals.heartRate} bpm`,
                icon: '❤️',
                ok: latestVitals.heartRate >= 60 && latestVitals.heartRate <= 100,
              },
              {
                label: 'Blood Pressure',
                value: `${latestVitals.systolic}/${latestVitals.diastolic}`,
                icon: '🩸',
                ok: latestVitals.systolic < 140,
              },
              {
                label: 'Oxygen',
                value: `${latestVitals.spo2}%`,
                icon: '💨',
                ok: latestVitals.spo2 >= 95,
              },
              {
                label: 'Temperature',
                value: `${latestVitals.temp}°F`,
                icon: '🌡️',
                ok: latestVitals.temp < 100.4,
              },
            ].map(v => (
              <View key={v.label} style={[gStyles.vitalItem, !v.ok && gStyles.vitalItemWarn]}>
                <Text style={gStyles.vitalIcon}>{v.icon}</Text>
                <Text style={[gStyles.vitalValue, !v.ok && gStyles.vitalValueWarn]}>{v.value}</Text>
                <Text style={gStyles.vitalLabel}>{v.label}</Text>
                <Text style={[gStyles.vitalStatus, v.ok ? gStyles.vitalStatusOk : gStyles.vitalStatusWarn]}>
                  {v.ok ? 'Normal' : 'Elevated'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const gStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Guardian.surfaceAlt },
  scroll: { flex: 1 },
  container: { padding: 16, gap: 16, paddingBottom: 32 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  greeting: { fontSize: 16, color: Guardian.textMuted },
  appName: { fontFamily: 'Georgia', fontSize: 26, fontWeight: '700', color: Guardian.primary },
  shieldBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Guardian.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  statusBannerOk: { backgroundColor: Guardian.primaryLight, borderColor: Guardian.border },
  statusBannerWarn: { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' },
  statusText: { flex: 1, gap: 4 },
  statusTitle: { fontSize: 16, fontWeight: '700', color: Guardian.primaryDark },
  statusTitleWarn: { color: '#92400E' },
  statusSub: { fontSize: 14, color: Guardian.textMuted, lineHeight: 20 },
  card: {
    backgroundColor: Guardian.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Guardian.border,
    gap: 12,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Guardian.text },
  cardSub: { fontSize: 13, color: Guardian.textMuted, marginTop: -6 },
  divider: { height: 1, backgroundColor: Guardian.border },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  timelineRowBorder: { borderBottomWidth: 1, borderBottomColor: Guardian.border },
  timelineIcon: { fontSize: 20 },
  timelineContent: { flex: 1, gap: 2 },
  timelineMsg: { fontSize: 14, color: Guardian.text, fontWeight: '500' },
  timelineTime: { fontSize: 12, color: Guardian.textMuted },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotOk: { backgroundColor: Guardian.primary },
  dotWarn: { backgroundColor: '#F59E0B' },
  demoTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Guardian.primaryLight,
    borderRadius: 10,
    padding: 12,
  },
  demoTipText: { fontSize: 13, color: Guardian.primaryDark, lineHeight: 19 },
  demoTipBold: { fontWeight: '700' },
  demoTipRetry: { fontSize: 13, fontWeight: '600', color: Guardian.primaryDark, textDecorationLine: 'underline' },
  simulateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Guardian.primary,
    borderStyle: 'dashed',
  },
  simulateBtnDisabled: { opacity: 0.5 },
  simulateBtnText: { fontSize: 13, fontWeight: '600', color: Guardian.primary },
  vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  vitalItem: {
    flex: 1,
    minWidth: '40%',
    backgroundColor: Guardian.surfaceAlt,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: Guardian.border,
  },
  vitalItemWarn: { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' },
  vitalIcon: { fontSize: 22 },
  vitalValue: { fontSize: 17, fontWeight: '700', color: Guardian.text },
  vitalValueWarn: { color: '#92400E' },
  vitalLabel: { fontSize: 12, color: Guardian.textMuted, textAlign: 'center' },
  vitalStatus: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  vitalStatusOk: { color: Guardian.primary },
  vitalStatusWarn: { color: '#D97706' },
});

// ─── Patient Home ─────────────────────────────────────────────────────────────

function PatientHome() {
  const [simulating, setSimulating] = useState(false);
  const [simulated, setSimulated] = useState(false);

  const handleSimulateAlert = async () => {
    setSimulating(true);
    try {
      const matched = evaluateRules(DEMO_HIGH_VITALS, NOTIFICATION_RULES);
      for (const rule of matched) {
        await scheduleRuleNotifications(rule);
      }
      setSimulated(true);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.appName}>AlwaysThere</Text>
          </View>
          <View style={styles.heartBadge}>
            <Ionicons name="heart" size={22} color={Brand.primary} />
          </View>
        </View>

        {/* Alerts Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="notifications" size={18} color={Brand.primary} />
            <Text style={styles.cardTitle}>Yesterday's Alerts</Text>
          </View>
          <Text style={styles.alertRecipient}>Sent to: son@gmail.com</Text>

          <View style={styles.divider} />

          {DUMMY_ALERTS.map((alert, i) => (
            <View
              key={i}
              style={[styles.alertRow, i < DUMMY_ALERTS.length - 1 && styles.alertRowBorder]}
            >
              <Text style={styles.alertIcon}>{alert.icon}</Text>
              <View style={styles.alertContent}>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                <Text style={styles.alertTime}>{alert.time}</Text>
              </View>
            </View>
          ))}

          <View style={styles.divider} />

          {simulated ? (
            <View style={styles.demoTip}>
              <Ionicons name="information-circle" size={18} color={Brand.primary} style={styles.demoTipIcon} />
              <View style={styles.demoTipBody}>
                <Text style={styles.demoTipText}>
                  <Text style={styles.demoTipBold}>This is a demo. </Text>
                  Exit the app now to see what a patient would experience — a notification will
                  arrive shortly, followed by a check-in 30 seconds later.
                </Text>
                <TouchableOpacity onPress={() => setSimulated(false)} activeOpacity={0.7}>
                  <Text style={styles.demoTipRetry}>Simulate again</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.simulateBtn, simulating && styles.simulateBtnDisabled]}
              onPress={handleSimulateAlert}
              disabled={simulating}
              activeOpacity={0.8}
            >
              {simulating ? (
                <ActivityIndicator size="small" color={Brand.primary} />
              ) : (
                <>
                  <Ionicons name="notifications-outline" size={15} color={Brand.primary} />
                  <Text style={styles.simulateBtnText}>Simulate high BP alert</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Heart Rate Chart Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="pulse" size={18} color={Brand.primary} />
            <Text style={styles.cardTitle}>Heart Rate — Last 7 Days</Text>
          </View>

          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Brand.primary }]} />
              <Text style={styles.legendText}>Heart rate (bpm)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: 'rgba(134, 239, 172, 0.9)' }]} />
              <Text style={styles.legendText}>Normal range (60–100)</Text>
            </View>
          </View>

          <View style={{ position: 'relative' }}>
            <LineChart
              data={chartData}
              width={CHART_INNER_WIDTH}
              height={CHART_HEIGHT}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              yAxisSuffix=""
              yAxisInterval={1}
              segments={4}
              {...({ yAxisMinValue: Y_MIN, yAxisMaxValue: Y_MAX } as object)}
            />
            {/* Normal band overlay: green semi-transparent rect */}
            <View
              style={[
                styles.normalBand,
                {
                  top: BAND_TOP,
                  left: CHART_LEFT_OFFSET,
                  width: CHART_INNER_WIDTH - CHART_LEFT_OFFSET - 8,
                  height: BAND_HEIGHT,
                },
              ]}
              pointerEvents="none"
            />
          </View>

          <Text style={styles.chartCaption}>Normal resting range: 60–100 bpm</Text>
        </View>

        {/* Today's Vitals Snapshot */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="stats-chart" size={18} color={Brand.primary} />
            <Text style={styles.cardTitle}>Today's Snapshot</Text>
          </View>
          <View style={styles.vitalsGrid}>
            {[
              { label: 'Heart Rate', value: `${VITALS_LAST_7_DAYS[6].heartRate} bpm`, icon: '❤️' },
              { label: 'SpO₂', value: `${VITALS_LAST_7_DAYS[6].spo2}%`, icon: '💨' },
              { label: 'Temp', value: `${VITALS_LAST_7_DAYS[6].temp}°F`, icon: '🌡️' },
              {
                label: 'Blood Pressure',
                value: `${VITALS_LAST_7_DAYS[6].systolic}/${VITALS_LAST_7_DAYS[6].diastolic}`,
                icon: '🩸',
              },
            ].map(v => (
              <View key={v.label} style={styles.vitalItem}>
                <Text style={styles.vitalIcon}>{v.icon}</Text>
                <Text style={styles.vitalValue}>{v.value}</Text>
                <Text style={styles.vitalLabel}>{v.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Brand.surfaceAlt,
  },
  scroll: {
    flex: 1,
  },
  container: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  greeting: {
    fontSize: 16,
    color: Brand.textMuted,
  },
  appName: {
    fontFamily: 'Georgia',
    fontSize: 26,
    fontWeight: '700',
    color: Brand.primary,
  },
  heartBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Brand.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Brand.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Brand.border,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.text,
  },
  alertRecipient: {
    fontSize: 13,
    color: Brand.textMuted,
    marginTop: -4,
  },
  divider: {
    height: 1,
    backgroundColor: Brand.border,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 6,
  },
  alertRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
  },
  alertIcon: {
    fontSize: 20,
    marginTop: 1,
  },
  alertContent: {
    flex: 1,
    gap: 2,
  },
  alertMessage: {
    fontSize: 14,
    color: Brand.text,
    fontWeight: '500',
  },
  alertTime: {
    fontSize: 12,
    color: Brand.textMuted,
  },
  demoTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Brand.primaryLight,
    borderRadius: 10,
    padding: 12,
  },
  demoTipIcon: {
    marginTop: 1,
  },
  demoTipBody: {
    flex: 1,
    gap: 6,
  },
  demoTipText: {
    fontSize: 13,
    color: Brand.primaryDark,
    lineHeight: 19,
  },
  demoTipBold: {
    fontWeight: '700',
  },
  demoTipRetry: {
    fontSize: 13,
    fontWeight: '600',
    color: Brand.primaryDark,
    textDecorationLine: 'underline',
  },
  simulateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Brand.primary,
    borderStyle: 'dashed',
  },
  simulateBtnDisabled: {
    opacity: 0.5,
  },
  simulateBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Brand.primary,
  },
  chartLegend: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: Brand.textMuted,
  },
  chart: {
    borderRadius: 8,
    marginLeft: -16,
  },
  normalBand: {
    position: 'absolute',
    backgroundColor: 'rgba(134, 239, 172, 0.28)',
  },
  chartCaption: {
    fontSize: 12,
    color: Brand.textMuted,
    textAlign: 'center',
    marginTop: -4,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vitalItem: {
    flex: 1,
    minWidth: '40%',
    backgroundColor: Brand.surfaceAlt,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  vitalIcon: {
    fontSize: 22,
  },
  vitalValue: {
    fontSize: 17,
    fontWeight: '700',
    color: Brand.text,
  },
  vitalLabel: {
    fontSize: 12,
    color: Brand.textMuted,
    textAlign: 'center',
  },
});

// ─── Root export — branches on role ──────────────────────────────────────────

export default function HomeScreen() {
  const { data } = useOnboarding();
  return data.role === 'New Guardian' ? <CaregiverHome /> : <PatientHome />;
}
