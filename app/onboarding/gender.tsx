import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PillButton } from '@/components/PillButton';
import { ProgressDots } from '@/components/ProgressDots';
import { Brand } from '@/constants/theme';
import { type Gender, useOnboarding } from '@/context/OnboardingContext';

const GENDERS: Gender[] = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

export default function GenderScreen() {
  const { data, setGender } = useOnboarding();
  const canContinue = data.gender !== null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Brand.text} />
        </TouchableOpacity>
        <ProgressDots total={6} current={3} />
        <View style={styles.backBtn} />
      </View>

      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.title}>Gender</Text>
          <Text style={styles.subtitle}>Select the patient's gender</Text>
        </View>

        <View style={styles.grid}>
          {GENDERS.map(g => (
            <View key={g} style={styles.gridItem}>
              <PillButton
                label={g!}
                selected={data.gender === g}
                onPress={() => setGender(g)}
                variant="pill"
              />
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btn, !canContinue && styles.btnDisabled]}
          onPress={() => router.push('/onboarding/email' as any)}
          disabled={!canContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </View>
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
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 32,
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
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    // Let PillButton size itself naturally in a flex-wrap row
  },
  btn: {
    backgroundColor: Brand.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 24,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
