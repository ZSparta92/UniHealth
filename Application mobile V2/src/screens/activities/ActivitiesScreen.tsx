import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivitiesStackParamList } from '../../navigation/types';
import { useActivities } from '../../hooks/useActivities';
import { Activity } from '../../models/Activity';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type ActivitiesScreenNavigationProp = NativeStackNavigationProp<ActivitiesStackParamList, 'Activities'>;

interface Props {
  navigation: ActivitiesScreenNavigationProp;
}

const ActivityCard: React.FC<{
  activity: Activity;
  onPress: (activityId: string) => void;
}> = ({ activity, onPress }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.activityCard, { backgroundColor: colors.background.card }]}
      onPress={() => onPress(activity.id)}
    >
      <View style={styles.activityHeader}>
        <Text style={styles.activityIcon}>{activity.icon || '🎯'}</Text>
        <View style={styles.activityInfo}>
          <Text style={[styles.activityTitle, { color: colors.text.primary }]}>{activity.title}</Text>
          <Text style={[styles.activityCategory, { color: colors.text.secondary }]}>{activity.category}</Text>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: colors.purple.light }]}>
          <Text style={[styles.difficultyText, { color: colors.purple.darker }]}>{activity.difficulty}</Text>
        </View>
      </View>
      <Text style={[styles.activityDescription, { color: colors.text.secondary }]} numberOfLines={2}>
        {activity.description}
      </Text>
      {activity.duration && (
        <Text style={[styles.activityDuration, { color: colors.text.secondary }]}>⏱ {activity.duration} min</Text>
      )}
    </TouchableOpacity>
  );
};

export const ActivitiesScreen: React.FC<Props> = ({ navigation }) => {
  const { activities, loading, refreshActivities } = useActivities();
  const { colors } = useTheme();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshActivities();
    });
    return unsubscribe;
  }, [navigation, refreshActivities]);

  const handleActivityPress = (activityId: string) => {
    navigation.navigate('ActivityDetail', { activityId });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.white }]}>
        <PurpleHeader title="Activities" />
        <ActivityIndicator size="large" color={colors.purple.medium} style={styles.loader} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="Activities" />
      
      {/* Action Button */}
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.purple.medium }]}
          onPress={() => navigation.navigate('CustomActivity')}
        >
          <Text style={[styles.addButtonText, { color: colors.text.white }]}>+</Text>
        </TouchableOpacity>
      </View>

      {activities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text.primary }]}>No activities available</Text>
          <Text style={[styles.emptySubtext, { color: colors.text.secondary }]}>Create a custom activity to get started</Text>
          <TouchableOpacity
            style={[styles.emptyButton, { backgroundColor: colors.purple.medium }]}
            onPress={() => navigation.navigate('CustomActivity')}
          >
            <Text style={[styles.emptyButtonText, { color: colors.text.white }]}>Create Activity</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ActivityCard activity={item} onPress={handleActivityPress} />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  activityCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  activityCategory: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  activityDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  activityDuration: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
