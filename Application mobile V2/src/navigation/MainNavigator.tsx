import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { CommunityChatScreen } from '../screens/community/CommunityChatScreen';
import { CommunityGroupListScreen } from '../screens/community/CommunityGroupListScreen';
import { CreateGroupScreen } from '../screens/community/CreateGroupScreen';
import { GroupChatScreen } from '../screens/community/GroupChatScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="CommunityChat" component={CommunityChatScreen} />
      <Stack.Screen name="CommunityGroupList" component={CommunityGroupListScreen} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Stack.Screen name="GroupChat" component={GroupChatScreen} />
    </Stack.Navigator>
  );
};
