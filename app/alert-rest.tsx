import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Brand } from '@/constants/theme';

export default function AlertRestScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <Text style={styles.emoji}>🚨</Text>
        </View>

        <Text style={styles.title}>Sit down and rest</Text>

        <Text style={styles.body}>
          Your readings look high. Please sit down comfortably, take a slow breath, and use your
          blood pressure monitor to take a reading now.
        </Text>

        <View style={styles.tip}>
          <Ionicons name="heart" size={20} color={Brand.primary} />
          <Text style={styles.tipText}>You're in good hands. We're keeping watch.</Text>
        </View>

        <TouchableOpacity style={styles.btn} onPress={() => router.back()} activeOpacity={0.85}>
          <Text style={styles.btnText}>Got it</Text>
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
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 34,
    fontWeight: '700',
    color: Brand.text,
    textAlign: 'center',
  },
  body: {
    fontSize: 22,
    color: Brand.text,
    textAlign: 'center',
    lineHeight: 34,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Brand.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tipText: {
    fontSize: 17,
    color: Brand.primaryDark,
    fontWeight: '500',
  },
  btn: {
    backgroundColor: Brand.primary,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 64,
    marginTop: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});
