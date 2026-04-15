import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { File, Paths } from 'expo-file-system/next';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { OnboardingProvider } from '@/context/OnboardingContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    try {
      const sentinel = new File(Paths.document, 'user_registered.json');
      setIsRegistered(sentinel.exists);
    } catch {
      setIsRegistered(false);
    } finally {
      setIsReady(true);
    }
  }, []);

  if (!isReady) return null;

  return (
    <OnboardingProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        {!isRegistered && <Redirect href={'/onboarding' as any} />}
        <StatusBar style="dark" />
      </ThemeProvider>
    </OnboardingProvider>
  );
}
