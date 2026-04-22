import { Platform, StyleSheet, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from '../theme/tokens';
import { ArticleDetailScreen } from '../features/news/screens/ArticleDetailScreen';
import { BookmarksScreen } from '../features/news/screens/BookmarksScreen';
import { FeedScreen } from '../features/news/screens/FeedScreen';
import type { BookmarksStackParamList, FeedStackParamList, RootTabParamList } from './types';
import { renderBookmarksTabIcon, renderFeedTabIcon } from './tabBarIcons';

const FeedStack = createNativeStackNavigator<FeedStackParamList>();
const BookmarksStack = createNativeStackNavigator<BookmarksStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.canvas,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.primary,
  },
};

const nativeStackScreenOptions = {
  headerBackButtonMenuEnabled: false,
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.primary,
  headerTitleStyle: {
    color: colors.text,
    fontWeight: '700' as const,
    fontSize: 17,
    letterSpacing: Platform.OS === 'ios' ? -0.4 : 0,
  },
  headerShadowVisible: false,
  contentStyle: { flex: 1, backgroundColor: colors.canvas },
} as const;

function FeedStackNavigator() {
  return (
    <FeedStack.Navigator screenOptions={nativeStackScreenOptions}>
      <FeedStack.Screen name="Feed" component={FeedScreen} options={{ title: 'Top stories' }} />
      <FeedStack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{ title: 'Story' }}
      />
    </FeedStack.Navigator>
  );
}

function BookmarksStackNavigator() {
  return (
    <BookmarksStack.Navigator screenOptions={nativeStackScreenOptions}>
      <BookmarksStack.Screen name="BookmarksList" component={BookmarksScreen} options={{ title: 'Bookmarks' }} />
      <BookmarksStack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{ title: 'Story' }}
      />
    </BookmarksStack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <View style={styles.root}>
      <NavigationContainer theme={navTheme}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            sceneStyle: { flex: 1 },
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              borderTopWidth: StyleSheet.hairlineWidth,
              height: Platform.OS === 'ios' ? 88 : 64,
              paddingTop: 6,
            },
            tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textMuted,
          }}>
          <Tab.Screen
            name="FeedStack"
            component={FeedStackNavigator}
            options={{
              tabBarLabel: 'Feed',
              tabBarIcon: renderFeedTabIcon,
            }}
          />
          <Tab.Screen
            name="BookmarksStack"
            component={BookmarksStackNavigator}
            options={{
              tabBarLabel: 'Saved',
              tabBarIcon: renderBookmarksTabIcon,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
