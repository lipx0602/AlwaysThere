import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
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

function formatPhone(digits: string): string {
  const d = digits.slice(0, 10);
  if (d.length === 0) return '';
  if (d.length <= 3) return `+1 (${d}`;
  if (d.length <= 6) return `+1 (${d.slice(0, 3)}) ${d.slice(3)}`;
  return `+1 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export default function PhoneScreen() {
  const { data, setPhone } = useOnboarding();
  const [touched, setTouched] = useState(false);

  const isValid = data.rawPhone.length === 10;
  const showError = touched && !isValid && data.rawPhone.length > 0;
  const canContinue = isValid;

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 10);
    setPhone(digits, formatPhone(digits));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Brand.text} />
        </TouchableOpacity>
        <ProgressDots total={6} current={5} />
        <View style={styles.backBtn} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <View style={styles.top}>
            <Text style={styles.title}>Phone number</Text>
            <Text style={styles.subtitle}>US numbers only — used for emergency alerts</Text>
          </View>

          <View>
            <TextInput
              style={[styles.input, showError && styles.inputError]}
              placeholder="+1 (___) ___-____"
              placeholderTextColor={Brand.textMuted}
              value={data.displayPhone}
              onChangeText={handleChange}
              onBlur={() => setTouched(true)}
              keyboardType="phone-pad"
              returnKeyType="done"
              onSubmitEditing={() => {
                setTouched(true);
                if (canContinue) router.push('/onboarding/goals' as any);
              }}
            />
            {showError && (
              <Text style={styles.errorText}>Please enter a valid 10-digit US number</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.btn, !canContinue && styles.btnDisabled]}
            onPress={() => {
              setTouched(true);
              if (canContinue) router.push('/onboarding/goals' as any);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Continue</Text>
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
  inputError: {
    borderColor: Brand.error,
  },
  errorText: {
    color: Brand.error,
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
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
