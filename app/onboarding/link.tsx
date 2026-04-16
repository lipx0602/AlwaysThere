import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ProgressDots } from '@/components/ProgressDots';
import { Brand } from '@/constants/theme';
import { useOnboarding } from '@/context/OnboardingContext';
import { saveProfile } from '@/services/storage';

export default function LinkScreen() {
  const { data, setCaregiverLinkCode } = useOnboarding();
  const [saving, setSaving] = useState(false);
  const canContinue = data.caregiverLinkCode.trim().length > 0;

  const handleFinish = async () => {
    setSaving(true);
    try {
      await saveProfile(data);
    } catch (e) {
      console.warn('Profile save failed', e);
    } finally {
      setSaving(false);
    }
    router.replace('/(tabs)' as any);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Brand.text} />
        </TouchableOpacity>
        <ProgressDots total={5} current={5} />
        <View style={styles.backBtn} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <View style={styles.top}>
            <Ionicons name="link" size={36} color={Brand.primary} />
            <Text style={styles.title}>Connect to your patient</Text>
            <Text style={styles.subtitle}>
              Enter the email address or 6-digit pairing code of the person you're caring for. They
              can find their code in the app settings.
            </Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Email or pairing code"
            placeholderTextColor={Brand.textMuted}
            value={data.caregiverLinkCode}
            onChangeText={setCaregiverLinkCode}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={() => canContinue && handleFinish()}
          />

          <TouchableOpacity
            style={[styles.btn, (!canContinue || saving) && styles.btnDisabled]}
            onPress={handleFinish}
            disabled={!canContinue || saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Finish & Connect</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Brand.surface,
  },
  flex: {
    flex: 1,
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
    gap: 24,
  },
  top: {
    gap: 10,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 26,
    fontWeight: '700',
    color: Brand.text,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 15,
    color: Brand.textMuted,
    lineHeight: 22,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Brand.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    color: Brand.text,
    backgroundColor: Brand.surfaceAlt,
  },
  btn: {
    backgroundColor: Brand.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
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
