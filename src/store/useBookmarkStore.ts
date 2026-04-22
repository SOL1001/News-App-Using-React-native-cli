import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { HNStory } from '../features/news/model/types';

interface BookmarkState {
  orderedIds: number[];
  storiesById: Record<number, HNStory>;
  toggleBookmark: (story: HNStory) => void;
  removeBookmark: (id: number) => void;
  isBookmarked: (id: number) => boolean;
  getOrderedBookmarks: () => HNStory[];
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      orderedIds: [],
      storiesById: {},
      toggleBookmark: story => {
        const { orderedIds, storiesById } = get();
        if (storiesById[story.id]) {
          const rest = { ...storiesById };
          delete rest[story.id];
          set({
            orderedIds: orderedIds.filter(x => x !== story.id),
            storiesById: rest,
          });
          return;
        }
        set({
          orderedIds: [...orderedIds, story.id],
          storiesById: { ...storiesById, [story.id]: story },
        });
      },
      removeBookmark: id => {
        const { orderedIds, storiesById } = get();
        if (!storiesById[id]) {
          return;
        }
        const rest = { ...storiesById };
        delete rest[id];
        set({
          orderedIds: orderedIds.filter(x => x !== id),
          storiesById: rest,
        });
      },
      isBookmarked: id => Boolean(get().storiesById[id]),
      getOrderedBookmarks: () => {
        const { orderedIds, storiesById } = get();
        return orderedIds.map(i => storiesById[i]).filter((s): s is HNStory => Boolean(s));
      },
    }),
    {
      name: 'awesomenews-bookmarks',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        orderedIds: state.orderedIds,
        storiesById: state.storiesById,
      }),
    },
  ),
);
