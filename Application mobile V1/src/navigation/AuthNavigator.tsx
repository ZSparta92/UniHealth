import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { UserStorage } from '../storage/userStorage';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  const [initialRoute, setInitialRoute] = useState<keyof AuthStackParamList>('Onboarding');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const determineInitialRoute = async () => {
      try {
        const isCompleted = await UserStorage.isOnboardingCompleted();
        const isFirstLaunch = await UserStorage.isFirstLaunch();
        
        if (isCompleted) {
          setInitialRoute('Welcome');
        } else if (!isFirstLaunch) {
          // Not first launch but onboarding not completed - go to welcome
          setInitialRoute('Welcome');
        } else {
          // First launch - show onboarding
          setInitialRoute('Onboarding');
        }
      } catch (error) {
        console.error('Error determining initial route:', error);
        setInitialRoute('Onboarding');
      } finally {
        setIsReady(true);
      }
    };

    determineInitialRoute();
  }, []);

  if (!isReady) {
    return null; // Or a loading spinner
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};
