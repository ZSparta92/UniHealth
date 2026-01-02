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
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Home' }}
      />
      <Stack.Screen 
        name="MoodEntry" 
        component={MoodEntryScreen} 
        options={{ title: 'Add Mood' }}
      />
      <Stack.Screen 
        name="MoodHistory" 
        component={MoodHistoryScreen} 
        options={{ title: 'Mood History' }}
      />
      <Stack.Screen 
        name="MoodDetail" 
        component={MoodDetailScreen} 
        options={{ title: 'Mood Details' }}
      />
      <Stack.Screen 
        name="SavorMoment" 
        component={SavorMomentScreen} 
        options={{ title: 'Savor the Moment' }}
      />
    </Stack.Navigator>
  );
};
