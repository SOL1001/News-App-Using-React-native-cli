import { memo, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, Platform, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Swipeable } from 'react-native-gesture-handler';
import { useShallow } from 'zustand/react/shallow';

import { BookmarkUnsavedIcon } from '../../../components/icons/NewsHeaderIcons';
import { colors, shadows, typography } from '../../../theme/tokens';
import type { BookmarksStackParamList } from '../../../navigation/types';
import { useBookmarkStore } from '../../../store/useBookmarkStore';
import { ArticleRow, articleRowKeyExtractor } from '../components/ArticleRow';
import { BookmarkSwipeActions } from '../components/BookmarkSwipeActions';
import type { HNStory } from '../model/types';

type RowProps = {
  item: HNStory;
  onOpen: (story: HNStory) => void;
  onRemove: (id: number) => void;
};

const BookmarkRow = memo(function BookmarkRowInner({ item, onOpen, onRemove }: RowProps) {
  const renderRightActions = useCallback(
    () => <BookmarkSwipeActions storyId={item.id} onRemove={onRemove} />,
    [item.id, onRemove],
  );

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      <ArticleRow story={item} onPress={onOpen} />
    </Swipeable>
  );
});

export function BookmarksScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BookmarksStackParamList>>();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: 'Bookmarks',
        headerTransparent: false,
        headerTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        contentStyle: { flex: 1, backgroundColor: colors.canvas },
        ...(Platform.OS === 'ios' ? { headerBlurEffect: 'none' as const } : {}),
      });
    }, [navigation]),
  );

  const bookmarks = useBookmarkStore(
    useShallow(s => s.orderedIds.map(id => s.storiesById[id]).filter((x): x is HNStory => Boolean(x))),
  );
  const removeBookmark = useBookmarkStore(s => s.removeBookmark);

  const onOpen = useCallback(
    (story: HNStory) => {
      navigation.navigate('ArticleDetail', { story });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<HNStory>) => (
      <BookmarkRow item={item} onOpen={onOpen} onRemove={removeBookmark} />
    ),
    [onOpen, removeBookmark],
  );

  const empty = useMemo(
    () => (
      <View style={styles.empty}>
        <View style={styles.emptyBadge}>
          <BookmarkUnsavedIcon color={colors.primary} size={28} />
        </View>
        <Text style={styles.emptyTitle}>No bookmarks yet</Text>
        <Text style={styles.emptyBody}>
          Open a story and tap the bookmark in the header to save it for later.
        </Text>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.flex}>
      <FlatList
        data={bookmarks}
        keyExtractor={articleRowKeyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={empty}
        contentContainerStyle={bookmarks.length === 0 ? styles.listContentEmpty : styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 28,
  },
  listContentEmpty: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: 28,
  },
  empty: {
    flex: 1,
    minHeight: 320,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...shadows.card,
  },
  emptyTitle: {
    ...typography.headline,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
