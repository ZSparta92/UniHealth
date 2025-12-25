import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import { HomeScreen } from '../screens/home/HomeScreen';
import { MoodEntryScreen } from '../screens/home/MoodEntryScreen';
import { MoodHistoryScreen } from '../screens/home/MoodHistoryScreen';
import { MoodDetailScreen } from '../screens/home/MoodDetailScreen';
import { SavorMomentScreen } from '../screens/home/SavorMomentScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MoodEntry" component={MoodEntryScreen} />
      <Stack.Screen name="MoodHistory" component={MoodHistoryScreen} />
      <Stack.Screen name="MoodDetail" component={MoodDetailScreen} />
      <Stack.Screen name="SavorMoment" component={SavorMomentScreen} />
    </Stack.Navigator>
  );
};
