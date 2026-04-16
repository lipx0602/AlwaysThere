import React, { createContext, useContext, useEffect, useState } from 'react';

import { loadProfile } from '@/services/storage';

export type Role = 'New Patient' | 'New Guardian' | null;
export type Gender = 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say' | null;
export type Goal = 'Diabetics' | 'Speeding Heart' | 'Sudden Fall' | 'Social Companion';

export interface OnboardingData {
  role: Role;
  name: string;
  gender: Gender;
  email: string;
  rawPhone: string;
  displayPhone: string;
  goals: Goal[];
  caregiverLinkCode: string;
  pairingCode: string;
}

interface OnboardingContextValue {
  data: OnboardingData;
  setRole: (r: Role) => void;
  setName: (n: string) => void;
  setGender: (g: Gender) => void;
  setEmail: (e: string) => void;
  setPhone: (raw: string, display: string) => void;
  toggleGoal: (g: Goal) => void;
  setCaregiverLinkCode: (code: string) => void;
  setPairingCode: (code: string) => void;
  initData: (d: OnboardingData) => void;
  resetData: () => void;
}

const defaultData: OnboardingData = {
  role: null,
  name: '',
  gender: null,
  email: '',
  rawPhone: '',
  displayPhone: '',
  goals: [],
  caregiverLinkCode: '',
  pairingCode: '',
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultData);

  // Hydrate context from AsyncStorage on first mount so returning users
  // see their profile data without going through onboarding again.
  useEffect(() => {
    loadProfile().then(saved => {
      if (saved) setData(saved);
    });
  }, []);

  const setRole = (role: Role) => setData(d => ({ ...d, role }));
  const setName = (name: string) => setData(d => ({ ...d, name }));
  const setGender = (gender: Gender) => setData(d => ({ ...d, gender }));
  const setEmail = (email: string) => setData(d => ({ ...d, email }));
  const setPhone = (rawPhone: string, displayPhone: string) =>
    setData(d => ({ ...d, rawPhone, displayPhone }));
  const toggleGoal = (goal: Goal) =>
    setData(d => ({
      ...d,
      goals: d.goals.includes(goal)
        ? d.goals.filter(g => g !== goal)
        : [...d.goals, goal],
    }));
  const setCaregiverLinkCode = (caregiverLinkCode: string) =>
    setData(d => ({ ...d, caregiverLinkCode }));
  const setPairingCode = (pairingCode: string) => setData(d => ({ ...d, pairingCode }));
  const initData = (d: OnboardingData) => setData(d);
  const resetData = () => setData(defaultData);

  return (
    <OnboardingContext.Provider
      value={{ data, setRole, setName, setGender, setEmail, setPhone, toggleGoal, setCaregiverLinkCode, setPairingCode, initData, resetData }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}
