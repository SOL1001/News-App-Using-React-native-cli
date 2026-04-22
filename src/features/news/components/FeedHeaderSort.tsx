import { memo } from 'react';

import { useFeedStore } from '../../../store/useFeedStore';
import { SortToggle } from './SortToggle';

type Props = {
  variant?: 'default' | 'embedded';
};

function FeedHeaderSortInner({ variant = 'default' }: Props) {
  const sortBy = useFeedStore(s => s.sortBy);
  const setSortBy = useFeedStore(s => s.setSortBy);
  return <SortToggle sortBy={sortBy} onChange={setSortBy} variant={variant} />;
}

export const FeedHeaderSort = memo(FeedHeaderSortInner);
