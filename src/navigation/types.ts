import type { HNStory } from '../features/news/model/types';

export type FeedStackParamList = {
  Feed: undefined;
  ArticleDetail: { story: HNStory };
};

export type BookmarksStackParamList = {
  BookmarksList: undefined;
  ArticleDetail: { story: HNStory };
};

export type RootTabParamList = {
  FeedStack: undefined;
  BookmarksStack: undefined;
};
