import { StyleSheet, View } from 'react-native';

import { BookmarkTabIcon, FeedTabIcon } from '../components/icons/NewsHeaderIcons';

export function renderFeedTabIcon({
  color,
  size,
  focused,
}: {
  color: string;
  size: number;
  focused: boolean;
}) {
  return (
    <View style={focused ? styles.iconActive : styles.iconInactive}>
      <FeedTabIcon color={color} size={size} focused={focused} />
    </View>
  );
}

export function renderBookmarksTabIcon({
  color,
  size,
  focused,
}: {
  color: string;
  size: number;
  focused: boolean;
}) {
  return (
    <View style={focused ? styles.iconActive : styles.iconInactive}>
      <BookmarkTabIcon color={color} size={size} focused={focused} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconActive: {
    opacity: 1,
  },
  iconInactive: {
    opacity: 0.75,
  },
});
