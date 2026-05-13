import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

// Main tab screens
import { HomeScreen } from '../screens/HomeScreen';
import { JourneyScreen } from '../screens/JourneyScreen';
import { GuideScreen } from '../screens/GuideScreen';
import { HelperScreen } from '../screens/HelperScreen';
import { CirclesScreen } from '../screens/CirclesScreen';

// Nested screens pushed from tabs
import { ServicesScreen } from '../screens/ServicesScreen';
import { AIScreen } from '../screens/AIScreen';

// ─── Stack navigators for Guide and Helper tabs ───────────────────────────────
const GuideStack = createStackNavigator();
const HelperStack = createStackNavigator();

const stackHeaderOptions = {
  headerStyle: { backgroundColor: theme.colors.primary.sageGreen },
  headerTintColor: theme.colors.text.inverse,
  headerTitleStyle: {
    fontWeight: theme.typography.fontWeight.bold as '700',
    fontSize: theme.typography.fontSize.lg,
  },
};

function GuideNavigator() {
  return (
    <GuideStack.Navigator screenOptions={stackHeaderOptions}>
      <GuideStack.Screen
        name="GuideMain"
        component={GuideScreen}
        options={{ title: 'The Guide' }}
      />
      <GuideStack.Screen
        name="Services"
        component={ServicesScreen}
        options={{ title: 'Local Services' }}
      />
    </GuideStack.Navigator>
  );
}

function HelperNavigator() {
  return (
    <HelperStack.Navigator screenOptions={stackHeaderOptions}>
      <HelperStack.Screen
        name="HelperMain"
        component={HelperScreen}
        options={{ title: 'The Helper' }}
      />
      <HelperStack.Screen
        name="AI"
        component={AIScreen}
        options={{ title: 'Ask the Roots AI' }}
      />
    </HelperStack.Navigator>
  );
}

// ─── Bottom Tab Navigator ─────────────────────────────────────────────────────
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
          } else if (route.name === 'Guide') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Helper') {
            iconName = focused ? 'build' : 'build-outline';
          } else if (route.name === 'Circles') {
            iconName = focused ? 'people' : 'people-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary.terracotta,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          ...theme.components.tabBar,
          backgroundColor: theme.colors.background.primary,
          borderTopColor: theme.colors.border.light,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.medium,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary.sageGreen,
        },
        headerTintColor: theme.colors.text.inverse,
        headerTitleStyle: {
          fontWeight: theme.typography.fontWeight.bold as '700',
          fontSize: theme.typography.fontSize.lg,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home', tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Journey"
        component={JourneyScreen}
        options={{ title: 'My Journey', tabBarLabel: 'Journey' }}
      />
      <Tab.Screen
        name="Guide"
        component={GuideNavigator}
        options={{ title: 'The Guide', tabBarLabel: 'Guide', headerShown: false }}
      />
      <Tab.Screen
        name="Helper"
        component={HelperNavigator}
        options={{ title: 'The Helper', tabBarLabel: 'Helper', headerShown: false }}
      />
      <Tab.Screen
        name="Circles"
        component={CirclesScreen}
        options={{ title: 'Local Circles', tabBarLabel: 'Circles' }}
      />
    </Tab.Navigator>
  );
};
