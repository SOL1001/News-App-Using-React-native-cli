import { useCallback, useLayoutEffect, useMemo, type ReactNode } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors, radii, typography } from '../../../theme/tokens';
import { formatRelativeTime } from '../../../shared/formatRelativeTime';
import { formatShortDate } from '../../../shared/formatShortDate';
import type { BookmarksStackParamList, FeedStackParamList } from '../../../navigation/types';
import { ArticleDetailHeaderActions } from '../components/ArticleDetailHeaderActions';

export type ArticleDetailScreenProps =
  | NativeStackScreenProps<FeedStackParamList, 'ArticleDetail'>
  | NativeStackScreenProps<BookmarksStackParamList, 'ArticleDetail'>;

function MetaLine({ label, children, isLast }: { label: string; children: ReactNode; isLast?: boolean }) {
  return (
    <View style={[styles.metaBlock, isLast && styles.metaBlockLast]}>
      <Text style={styles.metaLabel}>{label}</Text>
      {children}
    </View>
  );
}

export function ArticleDetailScreen({ route, navigation }: ArticleDetailScreenProps) {
  const { story } = route.params;
  const insets = useSafeAreaInsets();

  const renderHeaderRight = useCallback(() => <ArticleDetailHeaderActions variant="toolbar" />, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: false,
      headerShadowVisible: false,
      headerTintColor: colors.primary,
      headerStyle: { backgroundColor: colors.surface },
      headerRight: renderHeaderRight,
      contentStyle: { flex: 1, backgroundColor: colors.canvas },
      ...(Platform.OS === 'ios' ? { headerBlurEffect: 'none' as const } : {}),
    });
  }, [navigation, renderHeaderRight]);

  const openUrl = async () => {
    const can = await Linking.canOpenURL(story.url);
    if (can) {
      await Linking.openURL(story.url);
    }
  };

  const absoluteTime = useMemo(() => new Date(story.time * 1000).toLocaleString(), [story.time]);
  const summaryLine = useMemo(
    () =>
      `${story.score} points · ${story.by} · ${formatShortDate(story.time)} (${formatRelativeTime(story.time)})`,
    [story.by, story.score, story.time],
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 28 }]}
      showsVerticalScrollIndicator={false}
      bounces>
      <View style={styles.sheet}>
        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <Text style={styles.chipLabel}>ID</Text>
            <Text style={styles.chipValue}>{story.id}</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipLabel}>Score</Text>
            <Text style={styles.chipValue}>{story.score}</Text>
          </View>
        </View>

        <Text style={styles.title} selectable>
          {story.title}
        </Text>
        <Text style={styles.summary}>{summaryLine}</Text>

        <Text style={styles.linkLabel}>Link</Text>
        <View style={styles.urlWell}>
          <Text style={styles.urlInWell} selectable>
            {story.url}
          </Text>
        </View>

        <Text style={styles.sectionHeading}>Details</Text>
        <View style={styles.metaCard}>
          <MetaLine label="Story ID">
            <Text style={styles.metaValueMono}>{story.id}</Text>
          </MetaLine>
          <MetaLine label="Author">
            <Text style={styles.metaValue}>{story.by}</Text>
          </MetaLine>
          <MetaLine label="Score">
            <Text style={styles.metaValue}>{story.score}</Text>
          </MetaLine>
          <MetaLine label="Published">
            <Text style={styles.metaValue}>{absoluteTime}</Text>
          </MetaLine>
          <MetaLine label="URL" isLast>
            <Text style={styles.urlSmall} selectable numberOfLines={8}>
              {story.url}
            </Text>
          </MetaLine>
        </View>

        <Pressable
          onPress={openUrl}
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
          accessibilityRole="link">
          <Text style={styles.primaryBtnLabel}>Open in browser</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 12,
  },
  sheet: {
    marginHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.chipBg,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
  },
  chipLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  chipValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.3,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 30,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  summary: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: 20,
  },
  linkLabel: {
    ...typography.overline,
    color: colors.textMuted,
    marginBottom: 8,
  },
  urlWell: {
    backgroundColor: colors.headerIconBg,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 22,
  },
  urlInWell: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  sectionHeading: {
    ...typography.overline,
    color: colors.textMuted,
    marginBottom: 10,
  },
  metaCard: {
    backgroundColor: colors.headerIconBg,
    borderRadius: radii.lg,
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginBottom: 20,
  },
  metaBlock: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  metaBlockLast: {
    marginBottom: 0,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  metaValueMono: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
  },
  urlSmall: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: radii.pill,
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryBtnPressed: {
    backgroundColor: colors.primaryDark,
  },
  primaryBtnLabel: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});
