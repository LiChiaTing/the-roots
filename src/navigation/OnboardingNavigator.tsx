import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationSelectionScreen } from '../screens/onboarding/LocationSelectionScreen';
import { LanguageSelectionScreen } from '../screens/onboarding/LanguageSelectionScreen';
import { LandingScreen } from '../screens/onboarding/LandingScreen';

export type OnboardingStackParamList = {
  Landing: undefined;
  LanguageSelection: undefined;
  LocationSelection: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

interface CompleteUserData {
  state: string;
  zip: string;
  nativeLanguage: string;
  targetLanguage: string;
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

  const handleLocationSelected = async (state: string, zip: string) => {
    const completeUserData: CompleteUserData = {
      state,
      zip,
      nativeLanguage: userData.nativeLanguage!,
      targetLanguage: userData.targetLanguage!,
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
            onLocationSelected={handleLocationSelected}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
