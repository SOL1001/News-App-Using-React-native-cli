import { useCallback } from 'react';
import { Platform, Pressable, Share, StyleSheet, View } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';

import {
  BookmarkSavedIcon,
  BookmarkUnsavedIcon,
  ShareHeaderIcon,
} from '../../../components/icons/NewsHeaderIcons';
import { colors, radii } from '../../../theme/tokens';
import { useBookmarkStore } from '../../../store/useBookmarkStore';
import type { HNStory } from '../model/types';

type ArticleDetailRoute = RouteProp<{ ArticleDetail: { story: HNStory } }, 'ArticleDetail'>;

const ICON = 22;

type Props = {
  variant?: 'toolbar' | 'floating';
};

export function ArticleDetailHeaderActions({ variant = 'toolbar' }: Props) {
  const { params } = useRoute<ArticleDetailRoute>();
  const { story } = params;
  const floating = variant === 'floating';

  const isBookmarked = useBookmarkStore(s => s.isBookmarked(story.id));
  const toggleBookmark = useBookmarkStore(s => s.toggleBookmark);

  const share = useCallback(async () => {
    try {
      await Share.share(
        Platform.OS === 'ios'
          ? { title: story.title, url: story.url }
          : { title: story.title, message: `${story.title}\n${story.url}` },
      );
    } catch {}
  }, [story.title, story.url]);

  const onToggleBookmark = useCallback(() => {
    toggleBookmark(story);
  }, [story, toggleBookmark]);

  const bookmarkFilledColor = floating ? '#FFFFFF' : colors.primary;
  const bookmarkOutlineColor = floating ? 'rgba(255,255,255,0.92)' : colors.textSecondary;
  const shareColor = floating ? 'rgba(255,255,255,0.95)' : colors.textSecondary;

  return (
    <View style={styles.headerActions}>
      <Pressable
        onPress={onToggleBookmark}
        style={({ pressed }) => [
          styles.headerBtn,
          floating && styles.headerBtnFloating,
          pressed && (floating ? styles.headerBtnFloatingPressed : styles.headerBtnPressed),
        ]}
        accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}>
        {isBookmarked ? (
          <BookmarkSavedIcon color={bookmarkFilledColor} size={ICON} />
        ) : (
          <BookmarkUnsavedIcon color={bookmarkOutlineColor} size={ICON} />
        )}
      </Pressable>
      <Pressable
        onPress={share}
        style={({ pressed }) => [
          styles.headerBtn,
          floating && styles.headerBtnFloating,
          pressed && (floating ? styles.headerBtnFloatingPressed : styles.headerBtnPressed),
        ]}
        accessibilityLabel="Share story">
        <ShareHeaderIcon color={shareColor} size={ICON} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 4,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chipBg,
    borderWidth: 1,
    borderColor: colors.chipBorder,
  },
  headerBtnPressed: {
    backgroundColor: colors.border,
    borderColor: colors.borderStrong,
  },
  headerBtnFloating: {
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    borderColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: StyleSheet.hairlineWidth,
  },
  headerBtnFloatingPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
});
