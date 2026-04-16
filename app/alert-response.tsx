import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { NOTIFICATION_RULES } from '@/constants/notificationRules';
import { Brand } from '@/constants/theme';
import { scheduleEmergencyNotification } from '@/services/notificationService';

export default function AlertResponseScreen() {
  const { ruleId } = useLocalSearchParams<{ ruleId: string }>();
  const [answered, setAnswered] = useState<'yes' | 'no' | null>(null);

  const rule = NOTIFICATION_RULES.find(r => r.id === ruleId);

  // Find the systolic threshold to display in plain language
  const bpCondition = rule?.conditions.find(c => c.field === 'systolic');
  const threshold = bpCondition?.threshold ?? 140;

  useEffect(() => {
    if (answered === 'no') {
      const timer = setTimeout(() => router.back(), 3000);
      return () => clearTimeout(timer);
    }
  }, [answered]);

  const handleYes = async () => {
    setAnswered('yes');
    await scheduleEmergencyNotification();
  };

  const handleNo = () => {
    setAnswered('no');
  };

  if (answered === 'yes') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emergencyContainer}>
          <View style={styles.emergencyIcon}>
            <Ionicons name="warning" size={52} color="#fff" />
          </View>
          <Text style={styles.emergencyTitle}>Please call for help now</Text>
          <Text style={styles.emergencyBody}>
            We've alerted your care team. If you feel unwell, please call emergency services
            immediately. You are not alone.
          </Text>

          <TouchableOpacity
            style={[styles.callBtn, styles.callBtnEmergency]}
            onPress={() => Linking.openURL('tel:911')}
            activeOpacity={0.85}
          >
            <Ionicons name="call" size={26} color="#fff" />
            <Text style={styles.callBtnText}>Call 911</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.callBtn, styles.callBtnCaregiver]}
            onPress={() => Linking.openURL('tel:+1')}
            activeOpacity={0.85}
          >
            <Ionicons name="medkit" size={26} color="#fff" />
            <Text style={styles.callBtnText}>Call My Caregiver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.callBtn, styles.callBtnLovedOne]}
            onPress={() => Linking.openURL('tel:+1')}
            activeOpacity={0.85}
          >
            <Ionicons name="heart" size={26} color="#fff" />
            <Text style={styles.callBtnText}>Call a Loved One</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dismissBtn} onPress={() => router.back()}>
            <Text style={styles.dismissBtnText}>I'm okay, go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (answered === 'no') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.okContainer}>
          <Ionicons name="checkmark-circle" size={64} color={Brand.success} />
          <Text style={styles.okTitle}>Great — keep resting</Text>
          <Text style={styles.okBody}>
            Your blood pressure is heading in the right direction. Stay comfortable, stay hydrated,
            and we'll keep an eye on things for you.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.pulseIcon}>
            <Ionicons name="pulse" size={32} color={Brand.primary} />
          </View>
          <Text style={styles.title}>Blood pressure check</Text>
          <Text style={styles.body}>
            You took a reading a little while ago. Has your blood pressure reading come back{' '}
            <Text style={styles.bold}>{threshold} or above</Text> on the top number?
          </Text>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.yesBtn} onPress={handleYes} activeOpacity={0.85}>
            <Text style={styles.yesBtnText}>Yes, still high</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.noBtn} onPress={handleNo} activeOpacity={0.85}>
            <Text style={styles.noBtnText}>No, it's lower now</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>
          Tap the button that matches your reading. If you're unsure, tap "Yes, still high" so we
          can keep a close eye on you.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Brand.surface,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 40,
    gap: 36,
    justifyContent: 'center',
  },
  header: {
    gap: 16,
    alignItems: 'center',
  },
  pulseIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Brand.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 26,
    fontWeight: '700',
    color: Brand.text,
    textAlign: 'center',
  },
  body: {
    fontSize: 18,
    color: Brand.text,
    lineHeight: 28,
    textAlign: 'center',
  },
  bold: {
    fontWeight: '700',
    color: Brand.primaryDark,
  },
  buttons: {
    gap: 16,
  },
  yesBtn: {
    backgroundColor: Brand.error,
    borderRadius: 16,
    paddingVertical: 22,
    alignItems: 'center',
  },
  yesBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  noBtn: {
    backgroundColor: Brand.success,
    borderRadius: 16,
    paddingVertical: 22,
    alignItems: 'center',
  },
  noBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  hint: {
    fontSize: 14,
    color: Brand.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Emergency screen
  emergencyContainer: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: 'center',
    gap: 14,
    justifyContent: 'center',
  },
  emergencyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Brand.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emergencyTitle: {
    fontFamily: 'Georgia',
    fontSize: 28,
    fontWeight: '700',
    color: Brand.text,
    textAlign: 'center',
  },
  emergencyBody: {
    fontSize: 17,
    color: Brand.textMuted,
    textAlign: 'center',
    lineHeight: 26,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 24,
    gap: 12,
    width: '100%',
  },
  callBtnEmergency: {
    backgroundColor: Brand.error,
  },
  callBtnCaregiver: {
    backgroundColor: '#7C3AED',
  },
  callBtnLovedOne: {
    backgroundColor: Brand.primary,
  },
  callBtnText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  dismissBtn: {
    paddingVertical: 14,
  },
  dismissBtnText: {
    fontSize: 15,
    color: Brand.textMuted,
    textAlign: 'center',
  },
  // All good screen
  okContainer: {
    flex: 1,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  okTitle: {
    fontFamily: 'Georgia',
    fontSize: 26,
    fontWeight: '700',
    color: Brand.text,
    textAlign: 'center',
  },
  okBody: {
    fontSize: 17,
    color: Brand.textMuted,
    textAlign: 'center',
    lineHeight: 26,
  },
});
