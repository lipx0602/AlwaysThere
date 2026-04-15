import { Ionicons } from '@expo/vector-icons';
import { File, Paths } from 'expo-file-system/next';
import { router } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Brand } from '@/constants/theme';
import { useOnboarding } from '@/context/OnboardingContext';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '—'}</Text>
    </View>
  );
}

function SectionCard({ title, icon, children }: {
  title: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={18} color={Brand.primary} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.divider} />
      {children}
    </View>
  );
}

export default function ProfileScreen() {
  const { data, resetData } = useOnboarding();

  const handleReset = () => {
    Alert.alert(
      'Restart Onboarding',
      'This will clear your profile and take you back to the start.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            try {
              const sentinel = new File(Paths.document, 'user_registered.json');
              if (sentinel.exists) sentinel.delete();
            } catch (e) {
              console.warn('Could not delete sentinel', e);
            }
            resetData();
            router.replace('/onboarding' as any);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar & Name */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={Brand.primary} />
          </View>
          <Text style={styles.profileName}>{data.name || 'Your Name'}</Text>
          <Text style={styles.profileRole}>{data.role || 'Role not set'}</Text>
        </View>

        {/* Personal Info */}
        <SectionCard title="Personal Information" icon="person-circle">
          <InfoRow label="Full Name" value={data.name} />
          <InfoRow label="Role" value={data.role ?? ''} />
        </SectionCard>

        {/* Identity */}
        <SectionCard title="Identity" icon="id-card">
          <InfoRow label="Gender" value={data.gender ?? ''} />
        </SectionCard>

        {/* Contact */}
        <SectionCard title="Contact" icon="call">
          <InfoRow label="Email" value={data.email} />
          <InfoRow label="Phone" value={data.displayPhone} />
        </SectionCard>

        {/* Health Goals */}
        <SectionCard title="Health Goals" icon="fitness">
          {data.goals.length === 0 ? (
            <Text style={styles.emptyGoals}>No goals selected</Text>
          ) : (
            <View style={styles.goalsWrap}>
              {data.goals.map(goal => (
                <View key={goal} style={styles.goalBadge}>
                  <Text style={styles.goalBadgeText}>{goal}</Text>
                </View>
              ))}
            </View>
          )}
        </SectionCard>

        {/* Dev / Reset */}
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.8}>
          <Ionicons name="refresh" size={16} color={Brand.error} />
          <Text style={styles.resetBtnText}>Restart Onboarding</Text>
        </TouchableOpacity>
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Brand.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  profileName: {
    fontFamily: 'Georgia',
    fontSize: 22,
    fontWeight: '700',
    color: Brand.text,
  },
  profileRole: {
    fontSize: 14,
    color: Brand.textMuted,
  },
  card: {
    backgroundColor: Brand.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Brand.border,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.text,
  },
  divider: {
    height: 1,
    backgroundColor: Brand.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: Brand.textMuted,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: Brand.text,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  emptyGoals: {
    fontSize: 14,
    color: Brand.textMuted,
    fontStyle: 'italic',
  },
  goalsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalBadge: {
    backgroundColor: Brand.primaryLight,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Brand.primary,
  },
  goalBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Brand.primaryDark,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Brand.error,
  },
  resetBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Brand.error,
  },
});
