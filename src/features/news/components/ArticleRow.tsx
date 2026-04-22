import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, shadows } from '../../../theme/tokens';
import { formatRelativeTime } from '../../../shared/formatRelativeTime';
import { faviconUrlForDomain, sourceDomainFromUrl } from '../model/domainFromUrl';
import type { HNStory } from '../model/types';

export const LIST_ROW_HEIGHT = 128;

type Props = {
  story: HNStory;
  onPress: (story: HNStory) => void;
};

const FAVICON_SIZE = 20;

function ArticleRowInner({ story, onPress }: Props) {
  const [faviconFailed, setFaviconFailed] = useState(false);
  const domain = useMemo(() => sourceDomainFromUrl(story.url), [story.url]);
  const faviconUri = useMemo(() => faviconUrlForDomain(domain), [domain]);

  useEffect(() => {
    setFaviconFailed(false);
  }, [story.id, story.url]);

  const handlePress = useCallback(() => {
    onPress(story);
  }, [onPress, story]);

  const showPlaceholder = faviconFailed || !faviconUri;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.outer, pressed && styles.outerPressed]}
      accessibilityRole="button"
      accessibilityLabel={`Open story: ${story.title}`}>
      <View style={styles.card}>
        <View style={styles.accent} accessibilityElementsHidden />
        <View style={styles.body}>
          <View style={styles.domainRow}>
            {showPlaceholder ? (
              <View style={styles.faviconPlaceholder} accessibilityElementsHidden>
                <Text style={styles.faviconPlaceholderText}>HN</Text>
              </View>
            ) : (
              <Image
                source={{ uri: faviconUri }}
                style={styles.favicon}
                onError={() => setFaviconFailed(true)}
                accessibilityIgnoresInvertColors
              />
            )}
            <Text style={styles.domainLine} numberOfLines={1}>
              {domain || 'Source'}
            </Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {story.title}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            <Text style={styles.metaStrong}>{story.by}</Text>
            <Text style={styles.metaDim}>{` · ${story.score} pts · ${formatRelativeTime(story.time)}`}</Text>
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export const ArticleRow = memo(ArticleRowInner);

export function articleRowKeyExtractor(item: HNStory): string {
  return String(item.id);
}

const styles = StyleSheet.create({
  outer: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
  },
  outerPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.992 }],
  },
  card: {
    flexDirection: 'row',
    minHeight: 116,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadows.row,
  },
  accent: {
    width: 4,
    backgroundColor: colors.primary,
    opacity: 0.9,
  },
  body: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 12,
    paddingRight: 14,
    paddingLeft: 12,
    justifyContent: 'center',
  },
  domainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    minHeight: FAVICON_SIZE,
  },
  favicon: {
    width: FAVICON_SIZE,
    height: FAVICON_SIZE,
    borderRadius: 4,
    backgroundColor: colors.headerIconBg,
  },
  faviconPlaceholder: {
    width: FAVICON_SIZE,
    height: FAVICON_SIZE,
    borderRadius: 4,
    backgroundColor: colors.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faviconPlaceholderText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.3,
  },
  domainLine: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.35,
    lineHeight: 21,
  },
  meta: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  },
  metaStrong: {
    fontWeight: '600',
    color: colors.textSecondary,
  },
  metaDim: {
    fontWeight: '500',
    color: colors.textMuted,
  },
});
