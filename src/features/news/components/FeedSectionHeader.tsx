import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, typography } from '../../../theme/tokens';

type Props = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

function FeedSectionHeaderInner({ title, actionLabel = 'View all', onActionPress }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {onActionPress ? (
        <Pressable onPress={onActionPress} hitSlop={12} accessibilityRole="button">
          <Text style={styles.link}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export const FeedSectionHeader = memo(FeedSectionHeaderInner);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    ...typography.title,
    fontSize: 20,
    letterSpacing: -0.45,
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  link: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    overflow: 'hidden',
    backgroundColor: colors.chipBg,
  },
});
