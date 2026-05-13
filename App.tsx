import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { OnboardingNavigator } from './src/navigation/OnboardingNavigator';

export default function App() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<{
    state: string;
    nativeLanguage: string;
    targetLanguage: string;
    role?: string;
  } | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
      const storedUserData = await AsyncStorage.getItem('userData');

      if (onboardingCompleted === 'true' && storedUserData) {
        setIsOnboardingCompleted(true);
        setUserData(JSON.parse(storedUserData));
      } else {
        setIsOnboardingCompleted(false);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsOnboardingCompleted(false);
    }
  };

  const handleOnboardingComplete = (newUserData: {
    state: string;
    nativeLanguage: string;
    targetLanguage: string;
    role?: string;
  }) => {
    setUserData(newUserData);
    setIsOnboardingCompleted(true);
  };

  // Show loading screen while checking onboarding status
  if (isOnboardingCompleted === null) {
    return null; // Or a loading component
  }

  return (
    <NavigationContainer>
      {isOnboardingCompleted ? (
        <AppNavigator />
      ) : (
        <OnboardingNavigator onOnboardingComplete={handleOnboardingComplete} />
      )}
      <StatusBar style="dark" backgroundColor="transparent" translucent />
    </NavigationContainer>
  );
}
