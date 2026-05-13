import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationSelectionScreen } from '../screens/onboarding/LocationSelectionScreen';
import { LanguageSelectionScreen } from '../screens/onboarding/LanguageSelectionScreen';
import { LandingScreen } from '../screens/onboarding/LandingScreen';
import { RoleSelectionScreen } from '../screens/onboarding/RoleSelectionScreen';
import { UserRole } from '../types';

export type OnboardingStackParamList = {
  Landing: undefined;
  LanguageSelection: undefined;
  LocationSelection: undefined;
  RoleSelection: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

interface CompleteUserData {
  state: string;
  nativeLanguage: string;
  targetLanguage: string;
  role: UserRole;
}

interface OnboardingNavigatorProps {
  onOnboardingComplete: (userData: CompleteUserData) => void;
}

export const OnboardingNavigator: React.FC<OnboardingNavigatorProps> = ({
  onOnboardingComplete,
}) => {
  const [userData, setUserData] = useState<Partial<CompleteUserData>>({});

  const handleLanguagesSelected = (
    nativeLanguage: string,
    targetLanguage: string,
    goNext: () => void,
  ) => {
    setUserData(prev => ({ ...prev, nativeLanguage, targetLanguage }));
    goNext();
  };

  const handleLocationSelected = (state: string, goNext: () => void) => {
    setUserData(prev => ({ ...prev, state }));
    goNext();
  };

  const handleRoleSelected = async (role: UserRole) => {
    const completeUserData: CompleteUserData = {
      state: userData.state!,
      nativeLanguage: userData.nativeLanguage!,
      targetLanguage: userData.targetLanguage!,
      role,
    };

    await AsyncStorage.setItem('onboardingCompleted', 'true');
    await AsyncStorage.setItem('userData', JSON.stringify(completeUserData));

    onOnboardingComplete(completeUserData);
  };

  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="Landing">
        {({ navigation }) => (
          <LandingScreen onStart={() => navigation.navigate('LanguageSelection')} />
        )}
      </Stack.Screen>

      <Stack.Screen name="LanguageSelection">
        {({ navigation }) => (
          <LanguageSelectionScreen
            onLanguagesSelected={(native, target) =>
              handleLanguagesSelected(native, target, () =>
                navigation.navigate('LocationSelection'),
              )
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="LocationSelection">
        {({ navigation }) => (
          <LocationSelectionScreen
            onLocationSelected={(state) =>
              handleLocationSelected(state, () => navigation.navigate('RoleSelection'))
            }
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="RoleSelection">
        {({ navigation }) => (
          <RoleSelectionScreen
            onRoleSelected={handleRoleSelected}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
