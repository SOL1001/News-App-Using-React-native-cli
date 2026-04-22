import { memo, useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors, radii, shadows, typography } from '../../../theme/tokens';
import { formatRelativeTime } from '../../../shared/formatRelativeTime';
import type { HNStory } from '../model/types';

const PAGE_GAP = 16;
const CARD_MIN_H = 176;

type Props = {
  stories: HNStory[];
  onPress: (story: HNStory) => void;
};

type CardProps = {
  story: HNStory;
  pageWidth: number;
  onPress: (story: HNStory) => void;
};

const FeaturedCard = memo(function FeaturedCardInner({ story, pageWidth, onPress }: CardProps) {
  return (
    <View style={{ width: pageWidth, paddingHorizontal: PAGE_GAP }}>
      <Pressable
        onPress={() => onPress(story)}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        accessibilityRole="button"
        accessibilityLabel={`Featured: ${story.title}`}>
        <View style={styles.cardInner}>
          <View style={styles.topRow}>
            <View style={styles.scorePill}>
              <Text style={styles.scorePillText}>{story.score}</Text>
              <Text style={styles.scorePillSuffix}>pts</Text>
            </View>
            <Text style={styles.byLine} numberOfLines={1}>
              {story.by}
            </Text>
            <Text style={styles.time}>{formatRelativeTime(story.time)}</Text>
          </View>
          <Text style={styles.headline} numberOfLines={3}>
            {story.title}
          </Text>
          <View style={styles.urlWell}>
            <Text style={styles.url} numberOfLines={2}>
              {story.url}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
});

function FeaturedStoryCarouselInner({ stories, onPress }: Props) {
  const pageWidth = Dimensions.get('window').width;
  const [index, setIndex] = useState(0);

  const onScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const next = Math.round(x / pageWidth);
      setIndex(Math.min(Math.max(next, 0), stories.length - 1));
    },
    [pageWidth, stories.length],
  );

  const dots = useMemo(
    () =>
      stories.map((_, i) => (
        <View key={i} style={[styles.dot, i === index ? styles.dotActive : styles.dotIdle]} />
      )),
    [stories, index],
  );

  if (stories.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        onMomentumScrollEnd={onScrollEnd}
        onScrollEndDrag={onScrollEnd}
        accessibilityRole="adjustable"
        accessibilityLabel="Featured stories">
        {stories.map(story => (
          <FeaturedCard key={story.id} story={story} pageWidth={pageWidth} onPress={onPress} />
        ))}
      </ScrollView>
      <View style={styles.dotsRow}>{dots}</View>
    </View>
  );
}

export const FeaturedStoryCarousel = memo(FeaturedStoryCarouselInner);

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 10,
  },
  card: {
    minHeight: CARD_MIN_H,
    borderRadius: radii.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  cardPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.993 }],
  },
  cardInner: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: colors.chipBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
    gap: 4,
  },
  scorePillText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.3,
  },
  scorePillSuffix: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    opacity: 0.85,
    textTransform: 'uppercase',
  },
  byLine: {
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  time: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    flexShrink: 0,
  },
  headline: {
    ...typography.title,
    fontSize: 19,
    lineHeight: 25,
    letterSpacing: -0.4,
    color: colors.text,
    marginBottom: 12,
  },
  urlWell: {
    backgroundColor: colors.headerIconBg,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  url: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    marginBottom: 2,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.primary,
  },
  dotIdle: {
    width: 6,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
  },
});
