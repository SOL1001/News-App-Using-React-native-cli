import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radii, shadows } from '../../../theme/tokens';
import { LIST_ROW_HEIGHT } from './ArticleRow';

const LIST_ROWS = 7;

function SearchBarSkeleton() {
  return (
    <View style={styles.searchWrap}>
      <View style={styles.searchIconSlot}>
        <View style={[styles.block, styles.searchIcon]} />
      </View>
      <View style={[styles.block, styles.searchField]} />
      <View style={styles.searchSortSpacer} />
      <View style={styles.sortChips}>
        <View style={[styles.block, styles.sortChip]} />
        <View style={[styles.block, styles.sortChip]} />
      </View>
    </View>
  );
}

function SectionHeaderSkeleton() {
  return (
    <View style={styles.sectionRow}>
      <View style={[styles.block, styles.sectionTitle]} />
      <View style={[styles.block, styles.sectionAction]} />
    </View>
  );
}

function FeaturedCardSkeleton() {
  return (
    <View style={styles.featuredOuter}>
      <View style={styles.featuredCard}>
        <View style={styles.featuredTopRow}>
          <View style={[styles.block, styles.scorePillSk]} />
          <View style={[styles.block, styles.bySk]} />
          <View style={[styles.block, styles.timeSk]} />
        </View>
        <View style={[styles.block, styles.headlineSk]} />
        <View style={[styles.block, styles.headlineSk, styles.headlineSkMid]} />
        <View style={[styles.block, styles.headlineSk, styles.headlineSkShort]} />
        <View style={styles.urlWellSk}>
          <View style={[styles.block, styles.urlLineSk]} />
          <View style={[styles.block, styles.urlLineSk, styles.urlLineSkShort]} />
        </View>
      </View>
      <View style={styles.dotsRow}>
        {[0, 1, 2, 3, 4].map(i => (
          <View key={i} style={[styles.block, i === 0 ? styles.dotActiveSk : styles.dotIdleSk]} />
        ))}
      </View>
    </View>
  );
}

function ArticleRowSkeleton() {
  return (
    <View style={styles.rowOuter}>
      <View style={styles.rowCard}>
        <View style={styles.rowAccent} />
        <View style={styles.rowBody}>
          <View style={styles.domainRowSk}>
            <View style={[styles.block, styles.faviconSk]} />
            <View style={[styles.block, styles.domainLineSk]} />
          </View>
          <View style={[styles.block, styles.titleSk1]} />
          <View style={[styles.block, styles.titleSk2]} />
          <View style={[styles.block, styles.metaSkFull]} />
        </View>
      </View>
    </View>
  );
}

function FeedSkeletonInner() {
  return (
    <View style={styles.screen} accessibilityLabel="Loading stories">
      <SearchBarSkeleton />
      <SectionHeaderSkeleton />
      <FeaturedCardSkeleton />
      <SectionHeaderSkeleton />
      {Array.from({ length: LIST_ROWS }).map((_, i) => (
        <ArticleRowSkeleton key={i} />
      ))}
    </View>
  );
}

export const FeedSkeleton = memo(FeedSkeletonInner);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
    paddingTop: 8,
  },
  block: {
    backgroundColor: colors.skeleton,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    paddingLeft: 6,
    paddingRight: 6,
    minHeight: 48,
    borderRadius: 24,
    backgroundColor: colors.headerIconBg,
  },
  searchIconSlot: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.skeletonMuted,
  },
  searchField: {
    flex: 1,
    height: 14,
    borderRadius: 7,
    marginVertical: 10,
    marginRight: 8,
    backgroundColor: colors.skeletonMuted,
  },
  searchSortSpacer: {
    width: 10,
  },
  sortChips: {
    flexDirection: 'row',
    gap: 6,
    paddingRight: 4,
  },
  sortChip: {
    width: 52,
    height: 30,
    borderRadius: radii.pill,
    backgroundColor: colors.skeletonMuted,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    height: 22,
    borderRadius: 8,
    flex: 1,
    marginRight: 12,
    backgroundColor: colors.skeleton,
  },
  sectionAction: {
    width: 88,
    height: 32,
    borderRadius: radii.pill,
    backgroundColor: colors.chipBg,
    opacity: 0.85,
  },
  featuredOuter: {
    marginBottom: 10,
  },
  featuredCard: {
    marginHorizontal: 16,
    minHeight: 176,
    borderRadius: radii.xl,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    ...shadows.card,
  },
  featuredTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  scorePillSk: {
    width: 56,
    height: 28,
    borderRadius: radii.pill,
    backgroundColor: colors.skeletonMuted,
  },
  bySk: {
    flex: 1,
    height: 14,
    borderRadius: 7,
    minWidth: 0,
    backgroundColor: colors.skeletonMuted,
  },
  timeSk: {
    width: 48,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.skeletonMuted,
  },
  headlineSk: {
    width: '100%',
    height: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  headlineSkMid: {
    width: '78%',
  },
  headlineSkShort: {
    width: '55%',
    marginBottom: 12,
  },
  urlWellSk: {
    backgroundColor: colors.headerIconBg,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  urlLineSk: {
    height: 12,
    borderRadius: 6,
    width: '100%',
    marginBottom: 6,
    backgroundColor: colors.skeletonMuted,
  },
  urlLineSkShort: {
    width: '90%',
    marginBottom: 0,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    marginBottom: 2,
  },
  dotActiveSk: {
    width: 22,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.skeleton,
  },
  dotIdleSk: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderStrong,
  },
  rowOuter: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
    minHeight: LIST_ROW_HEIGHT - 12,
  },
  rowCard: {
    flexDirection: 'row',
    minHeight: 116,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadows.row,
  },
  rowAccent: {
    width: 4,
    backgroundColor: colors.primary,
    opacity: 0.35,
  },
  rowBody: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 12,
    paddingRight: 14,
    paddingLeft: 12,
    justifyContent: 'center',
  },
  domainRowSk: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    minHeight: 20,
  },
  faviconSk: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: colors.skeletonMuted,
  },
  domainLineSk: {
    flex: 1,
    marginLeft: 8,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.skeletonMuted,
  },
  titleSk1: {
    height: 14,
    borderRadius: 7,
    width: '96%',
    marginBottom: 6,
  },
  titleSk2: {
    height: 14,
    borderRadius: 7,
    width: '72%',
    marginBottom: 8,
  },
  metaSkFull: {
    height: 12,
    borderRadius: 6,
    width: '88%',
    backgroundColor: colors.skeletonMuted,
  },
});
