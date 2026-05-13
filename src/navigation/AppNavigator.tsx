import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { JourneyScreen } from '../screens/JourneyScreen';
import { FindScreen } from '../screens/FindScreen';
import { ServicesScreen } from '../screens/ServicesScreen';
import { AIScreen } from '../screens/AIScreen';

const HomeStack = createStackNavigator();
const FindStack = createStackNavigator();

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
        options={{ title: 'Home' }}
      />
      <HomeStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'My Profile & Settings' }}
      />
    </HomeStack.Navigator>
  );
}

function FindNavigator() {
  return (
    <FindStack.Navigator screenOptions={stackHeaderOptions}>
      <FindStack.Screen
        name="FindMain"
        component={FindScreen}
        options={{ title: 'Find' }}
      />
      <FindStack.Screen
        name="Services"
        component={ServicesScreen}
        options={{ title: 'Local Services' }}
      />
      <FindStack.Screen
        name="AI"
        component={AIScreen}
        options={{ title: 'Ask the Roots AI' }}
      />
    </FindStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Journey') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Find') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary.indigo,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          ...theme.components.tabBar,
          backgroundColor: theme.colors.background.primary,
          borderTopColor: theme.colors.border.light,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.fontFamily.bodyMedium,
          fontSize: theme.typography.fontSize.xs,
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
        component={JourneyScreen}
        options={{ title: 'My Journey', tabBarLabel: 'Journey' }}
      />
      <Tab.Screen
        name="Find"
        component={FindNavigator}
        options={{ title: 'Find', tabBarLabel: 'Find', headerShown: false }}
      />
    </Tab.Navigator>
  );
};
