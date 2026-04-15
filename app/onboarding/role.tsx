import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PillButton } from '@/components/PillButton';
import { ProgressDots } from '@/components/ProgressDots';
import { Brand } from '@/constants/theme';
import { type Role, useOnboarding } from '@/context/OnboardingContext';

export default function RoleScreen() {
  const { data, setRole } = useOnboarding();

  const handleSelect = (role: Role) => {
    setRole(role);
    router.push('/onboarding/name' as any);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Brand.text} />
        </TouchableOpacity>
        <ProgressDots total={6} current={1} />
        <View style={styles.backBtn} />
      </View>

      <View style={styles.container}>
        <View style={styles.top}>
          <Ionicons name="heart" size={40} color={Brand.primary} />
          <Text style={styles.title}>Who are you?</Text>
          <Text style={styles.subtitle}>This helps us personalize your experience</Text>
        </View>

        <View style={styles.cards}>
          <PillButton
            label="New Patient"
            selected={data.role === 'New Patient'}
            onPress={() => handleSelect('New Patient')}
            variant="card"
          />
          <PillButton
            label="New Guardian"
            selected={data.role === 'New Guardian'}
            onPress={() => handleSelect('New Guardian')}
            variant="card"
          />
        </View>
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
    gap: 40,
  },
  top: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 26,
    fontWeight: '700',
    color: Brand.text,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Brand.textMuted,
    textAlign: 'center',
  },
  cards: {
    gap: 16,
  },
});
