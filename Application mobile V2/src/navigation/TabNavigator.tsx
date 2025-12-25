import React from 'react';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStack } from './HomeStack';
import { ActivitiesStack } from './ActivitiesStack';
import { JournalStack } from './JournalStack';
import { ResourcesStack } from './ResourcesStack';
import { ProfileStack } from './ProfileStack';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

export const TabNavigator: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background.white,
          borderTopWidth: 0,
          // Increase height and bottom padding so the bar sits comfortably
          // above the very bottom edge and remains easily tappable,
          // while still respecting device safe area insets.
          height: 65 + insets.bottom,
          paddingBottom: Math.max(12, insets.bottom + 8),
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.purple.medium,
        tabBarInactiveTintColor: colors.text.primary,
        tabBarIconStyle: {
          fontSize: 24,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="JournalTab"
        component={JournalStack}
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Text style={{ fontSize: size, color }}>📖</Text>
          ),
        }}
      />
      <Tab.Screen
        name="ActivitiesTab"
        component={ActivitiesStack}
        options={{
          title: 'Activities',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Text style={{ fontSize: size, color }}>🎯</Text>
          ),
        }}
      />
      <Tab.Screen
        name="ResourcesTab"
        component={ResourcesStack}
        options={{
          title: 'Contact',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Text style={{ fontSize: size, color }}>📅</Text>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Text style={{ fontSize: size, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
