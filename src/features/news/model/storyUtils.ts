import type { HNStory, SortBy } from './types';

type StoryLike = Pick<HNStory, 'score' | 'time'>;

export function sortStories<T extends StoryLike>(stories: T[], sortBy: SortBy): T[] {
  const next = [...stories];
  if (sortBy === 'score') {
    next.sort((a, b) => b.score - a.score);
  } else {
    next.sort((a, b) => b.time - a.time);
  }
  return next;
}

export function filterValidStories(stories: HNStory[]): HNStory[] {
  return stories.filter(s => s.type === 'story' && typeof s.url === 'string' && s.url.length > 0);
}
