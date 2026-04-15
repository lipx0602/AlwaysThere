import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Brand } from '@/constants/theme';

interface ProgressDotsProps {
  total: number;
  current: number; // 1-based
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[styles.dot, i + 1 === current ? styles.dotActive : styles.dotInactive]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: Brand.primary,
    width: 24,
    borderRadius: 4,
  },
  dotInactive: {
    backgroundColor: Brand.border,
  },
});
