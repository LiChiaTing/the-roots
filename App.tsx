import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {
  NotoSans_400Regular,
  NotoSans_500Medium,
  NotoSans_600SemiBold,
  NotoSans_700Bold,
} from '@expo-google-fonts/noto-sans';
import {
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { AppNavigator } from './src/navigation/AppNavigator';
import { OnboardingNavigator } from './src/navigation/OnboardingNavigator';
import { GlassKitDemo } from './src/screens/GlassKitDemo';

// ⬇️ PREVIEW SWITCH — set to false to return to the real app.
// While true, the app boots straight into the liquid-glass component demo.
const PREVIEW_GLASS_KIT = false;

export default function App() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<{
    state: string;
    zip: string;
    nativeLanguage: string;
    targetLanguage: string;
  } | null>(null);

  const [fontsLoaded] = useFonts({
    NotoSans_400Regular,
    NotoSans_500Medium,
    NotoSans_600SemiBold,
    NotoSans_700Bold,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

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
    zip: string;
    nativeLanguage: string;
    targetLanguage: string;
  }) => {
    setUserData(newUserData);
    setIsOnboardingCompleted(true);
  };

  if (!fontsLoaded || isOnboardingCompleted === null) {
    return <View style={{ flex: 1, backgroundColor: '#ECECEC' }} />;
  }

  if (PREVIEW_GLASS_KIT) {
    return (
      <>
        <GlassKitDemo />
        <StatusBar style="dark" backgroundColor="transparent" translucent />
      </>
    );
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
