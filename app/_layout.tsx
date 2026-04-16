import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Redirect, Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';

import { OnboardingProvider } from '@/context/OnboardingContext';
import { requestPermissions } from '@/services/notificationService';
import { isRegistered } from '@/services/storage';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [registered, setRegistered] = useState(false);
  const responseListenerRef = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    isRegistered()
      .then(setRegistered)
      .finally(() => setIsReady(true));

    requestPermissions();

    // Route to the correct in-app screen when the user taps a notification
    responseListenerRef.current = Notifications.addNotificationResponseReceivedListener(
      response => {
        const deepLink = response.notification.request.content.data?.deepLink as
          | string
          | undefined;
        if (deepLink) {
          router.push(deepLink as any);
        }
      }
    );

    return () => {
      responseListenerRef.current?.remove();
    };
  }, []);

  if (!isReady) return null;

  return (
    <OnboardingProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen
            name="alert-rest"
            options={{ presentation: 'modal', headerShown: false }}
          />
          <Stack.Screen
            name="alert-response"
            options={{ presentation: 'modal', headerShown: false }}
          />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        {!registered && <Redirect href={'/onboarding' as any} />}
        <StatusBar style="dark" />
      </ThemeProvider>
    </OnboardingProvider>
  );
}
