import {
  logApiError,
  logApiRequest,
  logApiResponse,
  summarizeItemPayload,
  summarizeTopStoryIds,
} from '../../../shared/apiLogger';
import type { HNStory } from '../model/types';
import { filterValidStories } from '../model/storyUtils';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0/';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseStoryPayload(raw: unknown): HNStory | null {
  if (!isRecord(raw)) {
    return null;
  }
  if (raw.type !== 'story') {
    return null;
  }
  const url = raw.url;
  if (typeof url !== 'string' || url.length === 0) {
    return null;
  }
  const id = raw.id;
  const title = raw.title;
  const by = raw.by;
  const score = raw.score;
  const time = raw.time;
  if (
    typeof id !== 'number' ||
    typeof title !== 'string' ||
    typeof by !== 'string' ||
    typeof score !== 'number' ||
    typeof time !== 'number'
  ) {
    return null;
  }
  return { id, title, url, by, score, time, type: 'story' };
}

async function fetchJson(path: string): Promise<unknown> {
  const url = `${BASE_URL}${path}`;
  logApiRequest('GET', url);
  const started = Date.now();
  try {
    const res = await fetch(url);
    const ms = Date.now() - started;
    const body = (await res.json()) as unknown;
    const summary =
      path === 'topstories.json'
        ? summarizeTopStoryIds(body)
        : path.startsWith('item/')
          ? summarizeItemPayload(body)
          : typeof body === 'object'
            ? JSON.stringify(body, null, 2).slice(0, 3500)
            : String(body);
    logApiResponse(url, res.status, res.statusText, ms, summary);
    if (!res.ok) {
      throw new Error(`Request failed (${res.status})`);
    }
    return body;
  } catch (e) {
    logApiError(url, e);
    throw e;
  }
}

export async function fetchTopStoryIds(): Promise<number[]> {
  const data = await fetchJson('topstories.json');
  if (!Array.isArray(data) || !data.every((x): x is number => typeof x === 'number')) {
    throw new Error('Unexpected top stories response');
  }
  return data.slice(0, 20);
}

export async function loadTopStoriesForFeed(): Promise<HNStory[]> {
  const ids = await fetchTopStoryIds();
  const items = await Promise.all(
    ids.map(async id => {
      const raw = await fetchJson(`item/${id}.json`);
      return parseStoryPayload(raw);
    }),
  );
  const defined = items.filter((x): x is HNStory => x !== null);
  const filtered = filterValidStories(defined);
  console.log(
    `\n[HN API] loadTopStoriesForFeed summary\n` +
      `  requested item IDs: ${ids.length} (${JSON.stringify(ids)})\n` +
      `  parsed as story+url: ${defined.length}\n` +
      `  after filterValidStories: ${filtered.length}\n` +
      `  story ids kept: ${JSON.stringify(filtered.map(s => s.id))}\n`,
  );
  return filtered;
}
