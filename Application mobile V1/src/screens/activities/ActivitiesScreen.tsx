import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivitiesStackParamList } from '../../navigation/types';
import { useActivities } from '../../hooks/useActivities';
import { Activity } from '../../models/Activity';
import { colors } from '../../theme';

type ActivitiesScreenNavigationProp = NativeStackNavigationProp<ActivitiesStackParamList, 'Activities'>;

interface Props {
  navigation: ActivitiesScreenNavigationProp;
}

const ActivityCard: React.FC<{
  activity: Activity;
  onPress: (activityId: string) => void;
}> = ({ activity, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.activityCard}
      onPress={() => onPress(activity.id)}
    >
      <View style={styles.activityHeader}>
        <Text style={styles.activityIcon}>{activity.icon || '🎯'}</Text>
        <View style={styles.activityInfo}>
          <Text style={styles.activityTitle}>{activity.title}</Text>
          <Text style={styles.activityCategory}>{activity.category}</Text>
        </View>
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>{activity.difficulty}</Text>
        </View>
      </View>
      <Text style={styles.activityDescription} numberOfLines={2}>
        {activity.description}
      </Text>
      {activity.duration && (
        <Text style={styles.activityDuration}>⏱ {activity.duration} min</Text>
      )}
    </TouchableOpacity>
  );
};

export const ActivitiesScreen: React.FC<Props> = ({ navigation }) => {
  const { activities, loading, refreshActivities } = useActivities();

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
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.brandTitle}>UniHealth</Text>
          <Text style={styles.brandSubtitle}>Because your mental well-being matters.</Text>
          <TouchableOpacity style={styles.profileIcon}>
            <Text style={styles.profileIconText}>👤</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Activities</Text>
        </View>
        <ActivityIndicator size="large" color={colors.purple.medium} style={styles.loader} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>UniHealth</Text>
        <Text style={styles.brandSubtitle}>Because your mental well-being matters.</Text>
        <TouchableOpacity style={styles.profileIcon}>
          <Text style={styles.profileIconText}>👤</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <Text style={styles.screenTitle}>Activities</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CustomActivity')}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {activities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No activities available</Text>
          <Text style={styles.emptySubtext}>Create a custom activity to get started</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('CustomActivity')}
          >
            <Text style={styles.emptyButtonText}>Create Activity</Text>
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
    backgroundColor: colors.background.white,
  },
  header: {
    backgroundColor: colors.purple.light,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.purple.darker,
    textAlign: 'center',
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 12,
    color: colors.purple.darker,
    textAlign: 'center',
    marginBottom: 4,
  },
  profileIcon: {
    position: 'absolute',
    top: 12,
    right: 20,
  },
  profileIconText: {
    fontSize: 18,
    color: colors.text.white,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.text.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 28,
    color: colors.purple.medium,
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
    backgroundColor: colors.background.card,
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
    color: colors.text.primary,
    marginBottom: 4,
  },
  activityCategory: {
    fontSize: 14,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  difficultyBadge: {
    backgroundColor: colors.purple.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  activityDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  activityDuration: {
    fontSize: 12,
    color: colors.text.light,
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
    color: colors.text.primary,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  emptyButton: {
    backgroundColor: colors.purple.medium,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
