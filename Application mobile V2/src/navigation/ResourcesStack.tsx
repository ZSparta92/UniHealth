import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ResourcesStackParamList } from './types';
import { ResourcesScreen } from '../screens/resources/ResourcesScreen';
import { ResourceDetailScreen } from '../screens/resources/ResourceDetailScreen';
import { EmergencyContactsScreen } from '../screens/resources/EmergencyContactsScreen';
import { ExercisesScreen } from '../screens/resources/ExercisesScreen';
import { BreathingExerciseScreen } from '../screens/resources/BreathingExerciseScreen';
import { TherapistListScreen } from '../screens/resources/TherapistListScreen';
import { TherapistDetailScreen } from '../screens/resources/TherapistDetailScreen';
import { BookingScreen } from '../screens/resources/BookingScreen';
import { BookingConfirmationScreen } from '../screens/resources/BookingConfirmationScreen';
import { ChatScreen } from '../screens/resources/ChatScreen';
import { MyBookingsScreen } from '../screens/resources/MyBookingsScreen';

const Stack = createNativeStackNavigator<ResourcesStackParamList>();

export const ResourcesStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Resources" component={ResourcesScreen} />
      <Stack.Screen name="ResourceDetail" component={ResourceDetailScreen} />
      <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
      <Stack.Screen name="Exercises" component={ExercisesScreen} />
      <Stack.Screen name="BreathingExercise" component={BreathingExerciseScreen} />
      <Stack.Screen name="TherapistList" component={TherapistListScreen} options={{ title: 'Psychologists' }} />
      <Stack.Screen name="TherapistDetail" component={TherapistDetailScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Book Session' }} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} options={{ title: 'Confirmation' }} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: 'My Appointments' }} />
    </Stack.Navigator>
  );
};
