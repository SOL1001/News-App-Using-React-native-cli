import { memo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../theme/tokens';

export const FeedHeaderTitle = memo(function FeedHeaderTitleInner() {
  return (
    <View
      style={styles.wrap}
      accessibilityRole="header"
      accessibilityLabel="Top stories">
      <View style={styles.accent} accessibilityElementsHidden />
      <Text style={styles.wordmark}>
        <Text style={styles.top}>Top</Text>
        <Text style={styles.stories}> stories</Text>
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accent: {
    width: 3,
    height: 22,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginRight: 10,
  },
  wordmark: {
    ...Platform.select({
      ios: {
        textShadowColor: 'rgba(0, 0, 0, 0.06)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 0,
      },
      default: {},
    }),
  },
  top: {
    fontSize: 20,
    fontWeight: Platform.OS === 'ios' ? '800' : '700',
    color: colors.text,
    letterSpacing: -0.65,
  },
  stories: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: -0.45,
  },
});
