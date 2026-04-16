import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { Brand } from '@/constants/theme';
import { useOnboarding } from '@/context/OnboardingContext';

export default function PatientShareScreen() {
  const { data } = useOnboarding();
  const code = data.pairingCode;

  // QR encodes a deep-link that pre-fills the pairing code for the guardian
  const qrValue = `alwaysthere://join?code=${code}`;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.top}>
          <Ionicons name="checkmark-circle" size={48} color={Brand.success} />
          <Text style={styles.title}>You're all set!</Text>
          <Text style={styles.subtitle}>
            Share this with your guardian so they can connect to your account and keep an eye on
            you.
          </Text>
        </View>

        {/* QR card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Scan to download &amp; connect</Text>
          <View style={styles.qrWrap}>
            <QRCode
              value={qrValue}
              size={200}
              color={Brand.text}
              backgroundColor="#ffffff"
            />
          </View>
          <Text style={styles.qrHint}>
            Your guardian opens AlwaysThere, taps "New Guardian", and scans this code.
          </Text>
        </View>

        {/* Manual code card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Or share the pairing code manually</Text>
          <View style={styles.codeRow}>
            {code.split('').map((digit, i) => (
              <View key={i} style={styles.digitBox}>
                <Text style={styles.digit}>{digit}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.qrHint}>
            Your guardian enters this 6-digit code when setting up their account.
          </Text>
        </View>

        {/* Note */}
        <View style={styles.noteRow}>
          <Ionicons name="lock-closed" size={14} color={Brand.textMuted} />
          <Text style={styles.noteText}>
            This code is one-time use and will expire once a guardian links to your account.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.replace('/(tabs)' as any)}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Go to my dashboard</Text>
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
  container: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
    gap: 24,
    alignItems: 'center',
  },
  top: {
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 28,
    fontWeight: '700',
    color: Brand.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Brand.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    width: '100%',
    backgroundColor: Brand.surfaceAlt,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  qrWrap: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  qrHint: {
    fontSize: 13,
    color: Brand.textMuted,
    textAlign: 'center',
    lineHeight: 19,
  },
  codeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  digitBox: {
    width: 44,
    height: 52,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Brand.primary,
    backgroundColor: Brand.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digit: {
    fontSize: 26,
    fontWeight: '700',
    color: Brand.primaryDark,
    fontVariant: ['tabular-nums'],
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingHorizontal: 4,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: Brand.textMuted,
    lineHeight: 18,
  },
  btn: {
    width: '100%',
    backgroundColor: Brand.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
