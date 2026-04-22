import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radii } from '../../../theme/tokens';
import { LIST_ROW_HEIGHT } from './ArticleRow';

type Props = {
  storyId: number;
  onRemove: (id: number) => void;
};

function BookmarkSwipeActionsInner({ storyId, onRemove }: Props) {
  const onPress = useCallback(() => {
    onRemove(storyId);
  }, [onRemove, storyId]);

  return (
    <Pressable
      onPress={onPress}
      style={styles.removePane}
      accessibilityRole="button"
      accessibilityLabel="Remove bookmark">
      <Text style={styles.removeText}>Remove</Text>
    </Pressable>
  );
}

export const BookmarkSwipeActions = memo(BookmarkSwipeActionsInner);

const styles = StyleSheet.create({
  removePane: {
    flex: 1,
    minHeight: LIST_ROW_HEIGHT,
    backgroundColor: colors.destructive,
    justifyContent: 'center',
    paddingHorizontal: 22,
    borderTopLeftRadius: radii.lg,
    borderBottomLeftRadius: radii.lg,
  },
  removeText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
