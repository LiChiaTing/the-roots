import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

// Wireframe mode: PNG tab icons replaced with simple line (outline) icons
const TAB_ICONS = {
  Home:    'home-outline' as const,
  Journey: 'leaf-outline' as const,
  Guide:   'compass-outline' as const,
};

import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { JourneyScreen } from '../screens/JourneyScreen';
import { QuestDetailScreen } from '../screens/QuestDetailScreen';
import { GuideScreen } from '../screens/GuideScreen';
import { ServicesScreen } from '../screens/ServicesScreen';
import { AIScreen } from '../screens/AIScreen';

const HomeStack = createStackNavigator();
const JourneyStack = createStackNavigator();
const GuideStack = createStackNavigator();

const stackHeaderOptions = {
  headerStyle: { backgroundColor: theme.colors.primary.indigo },
  headerTintColor: theme.colors.text.inverse,
  headerTitleStyle: {
    fontFamily: theme.typography.fontFamily.displaySemibold,
    fontSize: theme.typography.fontSize.lg,
  },
};

function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={stackHeaderOptions}>
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'My Profile & Settings' }}
      />
    </HomeStack.Navigator>
  );
}

function JourneyNavigator() {
  return (
    <JourneyStack.Navigator screenOptions={stackHeaderOptions}>
      <JourneyStack.Screen
        name="JourneyMain"
        component={JourneyScreen}
        options={{ headerShown: false }}
      />
      <JourneyStack.Screen
        name="QuestDetail"
        component={QuestDetailScreen}
        options={({ route }: any) => ({ title: route.params?.quest?.title ?? 'Quest' })}
      />
    </JourneyStack.Navigator>
  );
}

function GuideNavigator() {
  return (
    <GuideStack.Navigator screenOptions={stackHeaderOptions}>
      <GuideStack.Screen
        name="GuideMain"
        component={GuideScreen}
        options={{ headerShown: false }}
      />
      <GuideStack.Screen
        name="Services"
        component={ServicesScreen}
        options={{ title: 'Local Services' }}
      />
      <GuideStack.Screen
        name="AI"
        component={AIScreen}
        options={{ title: 'Ask the Roots AI' }}
      />
    </GuideStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const name = TAB_ICONS[route.name as keyof typeof TAB_ICONS];
          if (!name) return null;
          return (
            <Ionicons
              name={name}
              size={26}
              color={focused ? theme.colors.text.primary : theme.colors.text.tertiary}
            />
          );
        },
        tabBarActiveTintColor: theme.colors.primary.indigo,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          ...theme.components.tabBar,
          backgroundColor: theme.colors.background.primary,
          borderTopColor: theme.colors.border.light,
          height: 76,
          paddingTop: 12,
          paddingBottom: 12,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.fontFamily.bodyMedium,
          fontSize: 10,
          marginTop: 2,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary.indigo,
        },
        headerTintColor: theme.colors.text.inverse,
        headerTitleStyle: {
          fontFamily: theme.typography.fontFamily.displaySemibold,
          fontSize: theme.typography.fontSize.lg,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{ title: 'Home', tabBarLabel: 'Home', headerShown: false }}
      />
      <Tab.Screen
        name="Journey"
        component={JourneyNavigator}
        options={{ title: 'My Journey', tabBarLabel: 'Journey', headerShown: false }}
      />
      <Tab.Screen
        name="Guide"
        component={GuideNavigator}
        options={{ title: 'Guide', tabBarLabel: 'Guide', headerShown: false }}
      />
    </Tab.Navigator>
  );
};
