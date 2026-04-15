import React, { createContext, useContext, useState } from 'react';

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
}

interface OnboardingContextValue {
  data: OnboardingData;
  setRole: (r: Role) => void;
  setName: (n: string) => void;
  setGender: (g: Gender) => void;
  setEmail: (e: string) => void;
  setPhone: (raw: string, display: string) => void;
  toggleGoal: (g: Goal) => void;
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
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultData);

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
  const resetData = () => setData(defaultData);

  return (
    <OnboardingContext.Provider
      value={{ data, setRole, setName, setGender, setEmail, setPhone, toggleGoal, resetData }}
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
