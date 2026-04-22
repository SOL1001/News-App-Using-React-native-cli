import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '../../../theme/tokens';

function OfflineBannerInner() {
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.kicker}>OFFLINE</Text>
      <Text style={styles.text}>You’re offline. Cached content is shown where available.</Text>
    </View>
  );
}

export const OfflineBanner = memo(OfflineBannerInner);

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.offlineBar,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(248, 250, 252, 0.12)',
  },
  kicker: {
    ...typography.overline,
    color: colors.textSubtle,
    marginBottom: 4,
    textAlign: 'center',
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.offlineBarText,
    textAlign: 'center',
    lineHeight: 18,
  },
});
