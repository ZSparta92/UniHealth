import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { JournalStackParamList } from './types';
import { JournalListScreen } from '../screens/journal/JournalListScreen';
import { JournalEntryScreen } from '../screens/journal/JournalEntryScreen';
import { JournalDetailScreen } from '../screens/journal/JournalDetailScreen';
import { JournalSearchScreen } from '../screens/journal/JournalSearchScreen';

const Stack = createNativeStackNavigator<JournalStackParamList>();

export const JournalStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="JournalList"
    >
      <Stack.Screen name="JournalList" component={JournalListScreen} />
      <Stack.Screen name="JournalEntry" component={JournalEntryScreen} />
      <Stack.Screen name="JournalDetail" component={JournalDetailScreen} />
      <Stack.Screen name="JournalSearch" component={JournalSearchScreen} />
    </Stack.Navigator>
  );
};
