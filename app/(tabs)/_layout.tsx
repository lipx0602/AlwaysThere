import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Brand, Guardian } from '@/constants/theme';
import { useOnboarding } from '@/context/OnboardingContext';

export default function TabLayout() {
  const { data } = useOnboarding();
  const isGuardian = data.role === 'New Guardian';
  const accent = isGuardian ? Guardian.primary : Brand.primary;
  const borderColor = isGuardian ? Guardian.border : Brand.border;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: accent,
        tabBarInactiveTintColor: '#9CA3AF',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          borderTopColor: borderColor,
          backgroundColor: Brand.surface,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: isGuardian ? 'Loved Ones' : 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={isGuardian ? 'people' : 'home'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
