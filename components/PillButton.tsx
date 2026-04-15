import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Brand } from '@/constants/theme';

interface PillButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  variant?: 'pill' | 'card';
}

export function PillButton({ label, selected, onPress, variant = 'pill' }: PillButtonProps) {
  const isCard = variant === 'card';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        isCard ? styles.card : styles.pill,
        selected && (isCard ? styles.cardSelected : styles.pillSelected),
      ]}
    >
      <Text
        style={[
          isCard ? styles.cardLabel : styles.pillLabel,
          selected && styles.labelSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
  },
  pillSelected: {
    borderColor: Brand.primary,
    backgroundColor: Brand.primaryLight,
  },
  pillLabel: {
    fontSize: 15,
    color: Brand.textMuted,
    fontWeight: '500',
  },
  card: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: Brand.primary,
    backgroundColor: Brand.primaryLight,
  },
  cardLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: Brand.text,
  },
  labelSelected: {
    color: Brand.primaryDark,
  },
});
