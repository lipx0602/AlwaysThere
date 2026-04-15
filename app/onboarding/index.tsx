import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Brand } from '@/constants/theme';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Ionicons name="heart" size={72} color={Brand.primary} />
          <Text style={styles.appName}>AlwaysThere</Text>
          <Text style={styles.tagline}>Health monitoring for those you love</Text>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.btnRegister}
            onPress={() => router.push('/onboarding/role' as any)}
            activeOpacity={0.85}
          >
            <Text style={styles.btnRegisterText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnLogin}
            onPress={() => router.replace('/(tabs)')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnLoginText}>I already have an account</Text>
          </TouchableOpacity>
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
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingTop: 60,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  appName: {
    fontFamily: 'Georgia',
    fontSize: 36,
    fontWeight: '700',
    color: Brand.text,
    marginTop: 8,
  },
  tagline: {
    fontSize: 16,
    color: Brand.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttons: {
    gap: 14,
  },
  btnRegister: {
    backgroundColor: Brand.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnRegisterText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  btnLogin: {
    borderWidth: 1.5,
    borderColor: Brand.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnLoginText: {
    color: Brand.primary,
    fontSize: 17,
    fontWeight: '600',
  },
});
