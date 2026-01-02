import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivitiesStackParamList } from './types';
import { ActivitiesScreen } from '../screens/activities/ActivitiesScreen';
import { ActivityDetailScreen } from '../screens/activities/ActivityDetailScreen';
import { ActivitySessionScreen } from '../screens/activities/ActivitySessionScreen';
import { CustomActivityScreen } from '../screens/activities/CustomActivityScreen';

const Stack = createNativeStackNavigator<ActivitiesStackParamList>();

export const ActivitiesStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Activities" component={ActivitiesScreen} />
      <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
      <Stack.Screen name="ActivitySession" component={ActivitySessionScreen} />
      <Stack.Screen name="CustomActivity" component={CustomActivityScreen} />
    </Stack.Navigator>
  );
};
