import { filterValidStories, sortStories } from '../src/features/news/model/storyUtils';
import type { HNStory } from '../src/features/news/model/types';

function story(overrides: Partial<HNStory>): HNStory {
  return {
    id: 1,
    title: 'Hello',
    url: 'https://example.com/a',
    by: 'alice',
    score: 10,
    time: 1_700_000_000,
    type: 'story',
    ...overrides,
  };
}

describe('sortStories', () => {
  it('orders by score descending by default sort mode', () => {
    const rows = [story({ id: 1, score: 2 }), story({ id: 2, score: 99 })];
    const sorted = sortStories(rows, 'score');
    expect(sorted.map(s => s.id)).toEqual([2, 1]);
  });

  it('orders by time descending when sort mode is time', () => {
    const rows = [story({ id: 1, time: 100 }), story({ id: 2, time: 500 })];
    const sorted = sortStories(rows, 'time');
    expect(sorted.map(s => s.id)).toEqual([2, 1]);
  });
});

describe('filterValidStories', () => {
  it('drops items without a URL even if marked story', () => {
    const rows = [
      story({ id: 1, url: 'https://ok.test' }),
      { ...story({ id: 2 }), url: '' },
    ];
    const filtered = filterValidStories(rows);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(1);
  });
});
