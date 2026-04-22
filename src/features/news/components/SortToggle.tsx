import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii } from '../../../theme/tokens';
import type { SortBy } from '../model/types';

type Props = {
  sortBy: SortBy;
  onChange: (next: SortBy) => void;
  variant?: 'default' | 'embedded';
};

function SortToggleInner({ sortBy, onChange, variant = 'default' }: Props) {
  const selectScore = useCallback(() => onChange('score'), [onChange]);
  const selectTime = useCallback(() => onChange('time'), [onChange]);
  const embedded = variant === 'embedded';

  return (
    <View style={[styles.wrap, embedded && styles.wrapEmbedded]} accessibilityRole="tablist">
      <Pressable
        onPress={selectScore}
        style={[styles.chip, embedded && styles.chipEmbedded, sortBy === 'score' && styles.chipActive]}
        accessibilityRole="tab"
        accessibilityState={{ selected: sortBy === 'score' }}>
        <Text
          style={[
            styles.label,
            embedded && styles.labelEmbedded,
            sortBy === 'score' && styles.labelActive,
          ]}>
          Score
        </Text>
      </Pressable>
      <Pressable
        onPress={selectTime}
        style={[styles.chip, embedded && styles.chipEmbedded, sortBy === 'time' && styles.chipActive]}
        accessibilityRole="tab"
        accessibilityState={{ selected: sortBy === 'time' }}>
        <Text
          style={[
            styles.label,
            embedded && styles.labelEmbedded,
            sortBy === 'time' && styles.labelActive,
          ]}>
          Time
        </Text>
      </Pressable>
    </View>
  );
}

export const SortToggle = memo(SortToggleInner);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    borderRadius: radii.pill,
    backgroundColor: colors.chipBg,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.chipBorder,
  },
  wrapEmbedded: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    padding: 2,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.pill,
  },
  chipEmbedded: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  chipActive: {
    backgroundColor: colors.surface,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  labelEmbedded: {
    fontSize: 12,
  },
  labelActive: {
    color: colors.primary,
  },
});
