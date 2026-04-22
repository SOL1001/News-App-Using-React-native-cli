import { memo } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  color: string;
  size: number;
};

export const ShareHeaderIcon = memo(function ShareHeaderIconInner({ color, size }: Props) {
  return <Ionicons name="share-outline" size={size} color={color} accessibilityElementsHidden />;
});

export const BookmarkSavedIcon = memo(function BookmarkSavedIconInner({ color, size }: Props) {
  return <Ionicons name="bookmark" size={size} color={color} accessibilityElementsHidden />;
});

export const BookmarkUnsavedIcon = memo(function BookmarkUnsavedIconInner({ color, size }: Props) {
  return <Ionicons name="bookmark-outline" size={size} color={color} accessibilityElementsHidden />;
});

export const BookmarkTabIcon = memo(function BookmarkTabIconInner({
  color,
  size,
  focused,
}: Props & { focused: boolean }) {
  return (
    <Ionicons
      name={focused ? 'bookmark' : 'bookmark-outline'}
      size={size}
      color={color}
      accessibilityElementsHidden
    />
  );
});

export const FeedTabIcon = memo(function FeedTabIconInner({
  color,
  size,
  focused,
}: Props & { focused: boolean }) {
  return (
    <Ionicons
      name={focused ? 'newspaper' : 'newspaper-outline'}
      size={size}
      color={color}
      accessibilityElementsHidden
    />
  );
});

export const SearchFieldIcon = memo(function SearchFieldIconInner({ color, size }: Props) {
  return <Ionicons name="search-outline" size={size} color={color} accessibilityElementsHidden />;
});
