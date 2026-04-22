import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  FlatList,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SearchFieldIcon } from '../../../components/icons/NewsHeaderIcons';
import type { FeedStackParamList } from '../../../navigation/types';
import { colors, radii, shadows, typography } from '../../../theme/tokens';
import { useDebouncedValue } from '../../../shared/useDebouncedValue';
import { useNetworkBanner } from '../../../shared/useNetworkBanner';
import { useFeedStore } from '../../../store/useFeedStore';
import {
  ArticleRow,
  LIST_ROW_HEIGHT,
  articleRowKeyExtractor,
} from '../components/ArticleRow';
import { FeedSkeleton } from '../components/FeedSkeleton';
import { FeaturedStoryCarousel } from '../components/FeaturedStoryCarousel';
import { FeedHeaderTitle } from '../components/FeedHeaderTitle';
import { FeedSectionHeader } from '../components/FeedSectionHeader';
import { FeedHeaderSort } from '../components/FeedHeaderSort';
import { OfflineBanner } from '../components/OfflineBanner';
import { sortStories } from '../model/storyUtils';
import type { HNStory } from '../model/types';

const RECENT_NEWS_MAX = 5;

export function FeedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FeedStackParamList>>();
  const flatListRef = useRef<FlatList<HNStory>>(null);
  const scrollYRef = useRef(0);

  const stories = useFeedStore(s => s.stories);
  const status = useFeedStore(s => s.status);
  const errorMessage = useFeedStore(s => s.errorMessage);
  const sortBy = useFeedStore(s => s.sortBy);
  const searchQuery = useFeedStore(s => s.searchQuery);
  const loadFeed = useFeedStore(s => s.loadFeed);
  const setListScrollOffset = useFeedStore(s => s.setListScrollOffset);
  const setSearchQuery = useFeedStore(s => s.setSearchQuery);

  const debouncedQuery = useDebouncedValue(searchQuery, 320);
  const showOffline = useNetworkBanner();

  useEffect(() => {
    loadFeed('initial').catch(() => {});
  }, [loadFeed]);

  const renderHeaderTitle = useCallback(() => <FeedHeaderTitle />, []);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: '',
        headerTitle: renderHeaderTitle,
        headerTitleAlign: 'center',
        headerLeft: undefined,
        headerRight: undefined,
        headerTransparent: false,
        headerTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        contentStyle: { flex: 1, backgroundColor: colors.canvas },
        ...(Platform.OS === 'ios' ? { headerBlurEffect: 'none' as const } : {}),
      });
      const y = useFeedStore.getState().listScrollOffset;
      const id = requestAnimationFrame(() => {
        flatListRef.current?.scrollToOffset({ offset: y, animated: false });
      });
      return () => {
        cancelAnimationFrame(id);
        setListScrollOffset(scrollYRef.current);
      };
    }, [navigation, renderHeaderTitle, setListScrollOffset]),
  );

  const visibleStories = useMemo(() => {
    const sorted = sortStories(stories, sortBy);
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) {
      return sorted;
    }
    return sorted.filter(s => s.title.toLowerCase().includes(q));
  }, [stories, sortBy, debouncedQuery]);

  const { featuredStories, listData } = useMemo(() => {
    const searching = debouncedQuery.trim().length > 0;
    if (searching) {
      return { featuredStories: [] as HNStory[], listData: visibleStories };
    }
    const newestFirst = sortStories(visibleStories, 'time');
    const featured = newestFirst.slice(0, RECENT_NEWS_MAX);
    const recentIds = new Set(featured.map(s => s.id));
    const list = visibleStories.filter(s => !recentIds.has(s.id));
    return { featuredStories: featured, listData: list };
  }, [visibleStories, debouncedQuery]);

  const onPressStory = useCallback(
    (story: HNStory) => {
      navigation.navigate('ArticleDetail', { story });
    },
    [navigation],
  );

  const scrollToFirstListRow = useCallback(() => {
    if (listData.length === 0) {
      return;
    }
    flatListRef.current?.scrollToIndex({ index: 0, animated: true });
  }, [listData.length]);

  const scrollToListEnd = useCallback(() => {
    if (listData.length === 0) {
      return;
    }
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [listData.length]);

  const listHeader = useMemo(() => {
    const searching = debouncedQuery.trim().length > 0;
    if (searching) {
      return null;
    }
    return (
      <View>
        {featuredStories.length > 0 ? (
          <>
            <FeedSectionHeader title="Recent News" onActionPress={scrollToFirstListRow} />
            <FeaturedStoryCarousel stories={featuredStories} onPress={onPressStory} />
          </>
        ) : null}
        {listData.length > 0 ? (
          <FeedSectionHeader title="All News" onActionPress={scrollToListEnd} />
        ) : null}
      </View>
    );
  }, [debouncedQuery, featuredStories, listData.length, onPressStory, scrollToFirstListRow, scrollToListEnd]);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollYRef.current = e.nativeEvent.contentOffset.y;
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<HNStory>) => <ArticleRow story={item} onPress={onPressStory} />,
    [onPressStory],
  );

  const getItemLayout = useCallback(
    (_data: ArrayLike<HNStory> | null | undefined, index: number) => ({
      length: LIST_ROW_HEIGHT,
      offset: LIST_ROW_HEIGHT * index,
      index,
    }),
    [],
  );

  const listEmpty =
    status === 'success' && listData.length === 0 && featuredStories.length === 0 ? (
      <View style={styles.emptyWrap}>
        <View style={styles.emptyBadge}>
          <Text style={styles.emptyBadgeText}>!</Text>
        </View>
        <Text style={styles.emptyTitle}>
          {debouncedQuery.trim().length > 0 ? 'No matches' : 'Nothing here yet'}
        </Text>
        <Text style={styles.emptyBody}>
          {debouncedQuery.trim().length > 0
            ? 'Try another search or clear the filter.'
            : 'Pull down to refresh the latest top stories.'}
        </Text>
      </View>
    ) : null;

  const showInitialShell =
    stories.length === 0 && (status === 'idle' || status === 'loading');

  if (showInitialShell) {
    return (
      <View style={styles.flex}>
        {showOffline ? <OfflineBanner /> : null}
        <FeedSkeleton />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.flex}>
        {showOffline ? <OfflineBanner /> : null}
        <View style={styles.centered}>
          <View style={styles.errorBadge}>
            <Text style={styles.errorBadgeText}>!</Text>
          </View>
          <Text style={styles.errorTitle}>Couldn’t load stories</Text>
          <Text style={styles.errorBody}>{errorMessage}</Text>
          <Pressable
            style={({ pressed }) => [styles.retry, pressed && styles.retryPressed]}
            onPress={() => {
              loadFeed('initial').catch(() => {});
            }}
            accessibilityRole="button">
            <Text style={styles.retryLabel}>Try again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      {showOffline ? <OfflineBanner /> : null}
      {errorMessage && status === 'success' ? (
        <View style={styles.softError}>
          <Text style={styles.softErrorText}>{errorMessage}</Text>
        </View>
      ) : null}
      <View style={styles.searchWrap}>
        <View style={styles.searchIconSlot} pointerEvents="none">
          <SearchFieldIcon color={colors.textMuted} size={20} />
        </View>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search"
          placeholderTextColor={colors.textSubtle}
          style={styles.search}
          autoCorrect={false}
          autoCapitalize="none"
          {...(Platform.OS === 'ios' ? { clearButtonMode: 'while-editing' as const } : {})}
          accessibilityLabel="Search stories by title"
        />
        <View style={styles.searchSortSpacer} />
        <FeedHeaderSort variant="embedded" />
      </View>
      <FlatList
        ref={flatListRef}
        data={listData}
        renderItem={renderItem}
        keyExtractor={articleRowKeyExtractor}
        getItemLayout={getItemLayout}
        onScroll={onScroll}
        scrollEventThrottle={32}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        onScrollToIndexFailed={() => {}}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={status === 'refreshing'}
            onRefresh={() => {
              loadFeed('refresh').catch(() => {});
            }}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        initialNumToRender={12}
        windowSize={7}
        maxToRenderPerBatch={12}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyWrap: {
    flex: 1,
    minHeight: 320,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyBadgeText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
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
  errorBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorBadgeText: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.errorText,
  },
  errorTitle: {
    ...typography.headline,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorBody: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retry: {
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: radii.pill,
    ...shadows.card,
  },
  retryPressed: {
    backgroundColor: colors.primaryDark,
  },
  retryLabel: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 16,
  },
  softError: {
    backgroundColor: colors.warnBg,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  softErrorText: {
    color: colors.warnText,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
    paddingLeft: 6,
    paddingRight: 6,
    minHeight: 48,
    borderRadius: 24,
    backgroundColor: colors.headerIconBg,
  },
  searchSortSpacer: {
    width: 10,
  },
  searchIconSlot: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 12,
    paddingRight: 8,
    fontSize: 16,
    color: colors.text,
  },
  listContent: {
    paddingTop: 6,
    paddingBottom: 28,
    flexGrow: 1,
  },
});
