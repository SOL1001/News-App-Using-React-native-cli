import { create } from 'zustand';

import { loadTopStoriesForFeed } from '../features/news/api/hnApi';
import type { HNStory, SortBy } from '../features/news/model/types';

export type FeedStatus = 'idle' | 'loading' | 'refreshing' | 'success' | 'error';

interface FeedState {
  stories: HNStory[];
  status: FeedStatus;
  errorMessage: string | null;
  sortBy: SortBy;
  listScrollOffset: number;
  searchQuery: string;
  loadFeed: (mode: 'initial' | 'refresh') => Promise<void>;
  setSortBy: (sort: SortBy) => void;
  setListScrollOffset: (y: number) => void;
  setSearchQuery: (q: string) => void;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  stories: [],
  status: 'loading',
  errorMessage: null,
  sortBy: 'score',
  listScrollOffset: 0,
  searchQuery: '',
  setSortBy: sortBy => set({ sortBy }),
  setListScrollOffset: listScrollOffset => set({ listScrollOffset }),
  setSearchQuery: searchQuery => set({ searchQuery }),
  loadFeed: async mode => {
    const isRefresh = mode === 'refresh';
    const hadStories = get().stories.length > 0;
    if (isRefresh || hadStories) {
      set({ status: 'refreshing', errorMessage: null });
    } else {
      set({ status: 'loading', errorMessage: null });
    }
    try {
      const stories = await loadTopStoriesForFeed();
      set({ stories, status: 'success', errorMessage: null });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Something went wrong';
      const previousStories = get().stories;
      if (previousStories.length === 0) {
        set({ status: 'error', errorMessage: message });
      } else {
        set({ status: 'success', errorMessage: message });
      }
    }
  },
}));
