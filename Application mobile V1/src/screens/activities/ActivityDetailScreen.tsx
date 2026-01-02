import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivitiesStackParamList } from '../../navigation/types';
import { useActivities } from '../../hooks/useActivities';
import { Activity } from '../../models/Activity';
import { colors } from '../../theme';
import { BackButton } from '../../components/common/BackButton';

type ActivityDetailScreenRouteProp = RouteProp<ActivitiesStackParamList, 'ActivityDetail'>;
type ActivityDetailScreenNavigationProp = NativeStackNavigationProp<ActivitiesStackParamList, 'ActivityDetail'>;

interface Props {
  route: ActivityDetailScreenRouteProp;
  navigation: ActivityDetailScreenNavigationProp;
}

export const ActivityDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { activityId } = route.params;
  const { getActivityById, getProgress } = useActivities();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivity();
  }, [activityId]);

  const loadActivity = async () => {
    try {
      setLoading(true);
      const activityData = await getActivityById(activityId);
      setActivity(activityData);
    } catch (error) {
      console.error('Error loading activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartActivity = async () => {
    navigation.navigate('ActivitySession', { activityId });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.purple.medium} />
      </View>
    );
  }

  if (!activity) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Activity not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.brandTitle}>UniHealth</Text>
        <Text style={styles.brandSubtitle}>Because your mental well-being matters.</Text>
        <TouchableOpacity style={styles.profileIcon}>
          <Text style={styles.profileIconText}>👤</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{activity.title}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Activity Icon & Info */}
        <View style={styles.activityHeader}>
          <Text style={styles.activityIcon}>{activity.icon || '🎯'}</Text>
          <View style={styles.activityMeta}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Category:</Text>
              <Text style={styles.metaValue}>{activity.category}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Difficulty:</Text>
              <Text style={styles.metaValue}>{activity.difficulty}</Text>
            </View>
            {activity.duration && (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Duration:</Text>
                <Text style={styles.metaValue}>{activity.duration} minutes</Text>
              </View>
            )}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{activity.description}</Text>
        </View>

        {/* Benefits */}
        {activity.benefits.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Benefits</Text>
            {activity.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Text style={styles.benefitBullet}>•</Text>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Instructions */}
        {activity.instructions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {activity.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Start Button */}
        <TouchableOpacity style={styles.startButton} onPress={handleStartActivity}>
          <Text style={styles.startButtonText}>Start Activity</Text>
        </TouchableOpacity>
      </ScrollView>
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
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  activityHeader: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  activityIcon: {
    fontSize: 64,
    marginRight: 16,
  },
  activityMeta: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginRight: 8,
  },
  metaValue: {
    fontSize: 16,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  benefitBullet: {
    fontSize: 20,
    color: colors.purple.medium,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
    lineHeight: 24,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.purple.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  instructionText: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: colors.purple.medium,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  startButtonText: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 40,
  },
});
