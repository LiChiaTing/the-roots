import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

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
        options={({ navigation }) => ({
          title: 'Home',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              style={{ marginRight: 16 }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="person-circle-outline" size={28} color="#fff" />
            </TouchableOpacity>
          ),
        })}
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
        options={{ title: 'My Journey' }}
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
        options={{ title: 'Guide' }}
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
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Journey') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Guide') {
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
