import AsyncStorage from '@react-native-async-storage/async-storage';

import { type OnboardingData } from '@/context/OnboardingContext';

const PROFILE_KEY = '@alwaysthere/profile';
const REGISTERED_KEY = '@alwaysthere/registered';

export async function saveProfile(data: OnboardingData): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(data));
  await AsyncStorage.setItem(
    REGISTERED_KEY,
    JSON.stringify({ registeredAt: new Date().toISOString() })
  );
}

export async function loadProfile(): Promise<OnboardingData | null> {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as OnboardingData;
}

export async function clearProfile(): Promise<void> {
  await AsyncStorage.multiRemove([PROFILE_KEY, REGISTERED_KEY]);
}

export async function isRegistered(): Promise<boolean> {
  const val = await AsyncStorage.getItem(REGISTERED_KEY);
  return val !== null;
}
