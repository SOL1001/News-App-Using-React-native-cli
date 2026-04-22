export interface HNStory {
  id: number;
  title: string;
  url: string;
  by: string;
  score: number;
  time: number;
  type: 'story';
}

export type SortBy = 'score' | 'time';
