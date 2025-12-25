import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ResourcesStackParamList } from '../../navigation/types';
import { useActivities } from '../../hooks/useActivities';
import { Activity } from '../../models/Activity';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type ExercisesScreenNavigationProp = NativeStackNavigationProp<ResourcesStackParamList, 'Exercises'>;

interface Props {
  navigation: ExercisesScreenNavigationProp;
}

interface ExerciseItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  type: 'breathing' | 'activity';
  activityId?: string;
}

const ExerciseCard: React.FC<{
  exercise: ExerciseItem;
  onPress: (exercise: ExerciseItem) => void;
}> = ({ exercise, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.exerciseCard}
      onPress={() => onPress(exercise)}
    >
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseIcon}>{exercise.icon}</Text>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseTitle}>{exercise.title}</Text>
          <Text style={styles.exerciseCategory}>{exercise.category}</Text>
        </View>
      </View>
      <Text style={styles.exerciseDescription} numberOfLines={2}>
        {exercise.description}
      </Text>
    </TouchableOpacity>
  );
};

export const ExercisesScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { activities, loading, refreshActivities } = useActivities();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshActivities();
    });
    return unsubscribe;
  }, [navigation, refreshActivities]);

  // Create exercise items: Breathing Exercise + Activities
  const exerciseItems: ExerciseItem[] = [
    {
      id: 'breathing',
      title: 'Breathing Exercise',
      description: 'Guided breathing exercises for stress relief and relaxation',
      icon: '🫁',
      category: 'Breathing',
      type: 'breathing',
    },
    ...activities.map((activity) => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      icon: activity.icon || '🎯',
      category: activity.category,
      type: 'activity' as const,
      activityId: activity.id,
    })),
  ];

  const handleExercisePress = (exercise: ExerciseItem) => {
    if (exercise.type === 'breathing') {
      navigation.navigate('BreathingExercise');
    } else if (exercise.activityId) {
      // Navigate to Activities tab if it exists in the tab navigator
      // Using same pattern as HomeScreen: getParent()?.getParent() to reach TabNavigator
      const tabNav = navigation.getParent()?.getParent();
      
      if (tabNav) {
        // Use same pattern as HomeScreen: simple navigate() call
        (tabNav as any).navigate('ActivitiesTab', {
          screen: 'ActivityDetail',
          params: { activityId: exercise.activityId },
        });
      }
    }
  };

  if (loading && exerciseItems.length === 1) {
    return (
      <View style={styles.container}>
        <PurpleHeader title="Exercises" showBack />
        <ActivityIndicator size="large" color={colors.purple.medium} style={styles.loader} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="Exercises" showBack />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionDescription, { color: colors.text.secondary }]}>
          Practice exercises to improve your mental well-being and manage stress.
        </Text>

        {exerciseItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text.primary }]}>No exercises available</Text>
            <Text style={[styles.emptySubtext, { color: colors.text.secondary }]}>Check back later for new exercises</Text>
          </View>
        ) : (
          <View style={styles.exercisesList}>
            {exerciseItems.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onPress={handleExercisePress}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionDescription: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  exercisesList: {
    gap: 16,
  },
  exerciseCard: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseCategory: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  exerciseDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
  loader: {
    marginTop: 40,
  },
});

