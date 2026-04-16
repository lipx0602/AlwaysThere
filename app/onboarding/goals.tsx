import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { PillButton } from '@/components/PillButton';
import { ProgressDots } from '@/components/ProgressDots';
import { Brand } from '@/constants/theme';
import { type Goal, useOnboarding } from '@/context/OnboardingContext';
import { saveProfile } from '@/services/storage';

function generatePairingCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const ALL_GOALS: Goal[] = ['Diabetics', 'Speeding Heart', 'Sudden Fall', 'Social Companion'];

const GOAL_ICONS: Record<Goal, string> = {
  Diabetics: '🩺',
  'Speeding Heart': '❤️‍🔥',
  'Sudden Fall': '🚨',
  'Social Companion': '🤝',
};

export default function GoalsScreen() {
  const { data, toggleGoal, setPairingCode } = useOnboarding();
  const [saving, setSaving] = useState(false);

  const handleFinish = async () => {
    setSaving(true);
    try {
      const code = generatePairingCode();
      setPairingCode(code);
      await saveProfile({ ...data, pairingCode: code });
    } catch (e) {
      console.warn('Profile save failed', e);
    } finally {
      setSaving(false);
    }
    router.push('/onboarding/patient-share' as any);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Brand.text} />
        </TouchableOpacity>
        <ProgressDots total={6} current={6} />
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.top}>
          <Text style={styles.title}>Health goals</Text>
          <Text style={styles.subtitle}>
            Select all conditions or needs that apply (you can choose multiple)
          </Text>
        </View>

        <View style={styles.goals}>
          {ALL_GOALS.map(goal => (
            <TouchableOpacity
              key={goal}
              onPress={() => toggleGoal(goal)}
              activeOpacity={0.8}
              style={[
                styles.goalCard,
                data.goals.includes(goal) && styles.goalCardSelected,
              ]}
            >
              <Text style={styles.goalIcon}>{GOAL_ICONS[goal]}</Text>
              <Text
                style={[
                  styles.goalLabel,
                  data.goals.includes(goal) && styles.goalLabelSelected,
                ]}
              >
                {goal}
              </Text>
              {data.goals.includes(goal) && (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={Brand.primary}
                  style={styles.check}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btn, saving && styles.btnDisabled]}
          onPress={handleFinish}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Finish & Save Profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Brand.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 40,
    alignItems: 'flex-start',
  },
  scroll: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 28,
  },
  top: {
    gap: 8,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 26,
    fontWeight: '700',
    color: Brand.text,
  },
  subtitle: {
    fontSize: 15,
    color: Brand.textMuted,
    lineHeight: 22,
  },
  goals: {
    gap: 14,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
  },
  goalCardSelected: {
    borderColor: Brand.primary,
    backgroundColor: Brand.primaryLight,
  },
  goalIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  goalLabel: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: Brand.text,
  },
  goalLabelSelected: {
    color: Brand.primaryDark,
  },
  check: {
    marginLeft: 8,
  },
  btn: {
    backgroundColor: Brand.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
