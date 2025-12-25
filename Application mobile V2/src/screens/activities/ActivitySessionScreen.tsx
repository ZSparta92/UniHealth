import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivitiesStackParamList } from '../../navigation/types';
import { useActivities } from '../../hooks/useActivities';
import { Activity } from '../../models/Activity';
import { useTheme, ColorScheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type ActivitySessionScreenRouteProp = RouteProp<ActivitiesStackParamList, 'ActivitySession'>;
type ActivitySessionScreenNavigationProp = NativeStackNavigationProp<ActivitiesStackParamList, 'ActivitySession'>;

interface Props {
  route: ActivitySessionScreenRouteProp;
  navigation: ActivitySessionScreenNavigationProp;
}

export const ActivitySessionScreen: React.FC<Props> = ({ route, navigation }) => {
  const { activityId } = route.params;
  const { getActivityById, createSession, updateSession } = useActivities();
  const { colors } = useTheme();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Create styles with theme colors
  const styles = useMemo(() => makeStyles(colors), [colors]);

  useEffect(() => {
    loadActivity();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activityId]);

  useEffect(() => {
    if (sessionStarted && !paused) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sessionStarted, paused]);

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

  const handleStartSession = async () => {
    try {
      const session = await createSession(activityId);
      setSessionId(session.id);
      setSessionStarted(true);
      setElapsedTime(0);
    } catch (error) {
      Alert.alert('Error', 'Failed to start session');
    }
  };

  const handleEndSession = async () => {
    Alert.alert(
      'End Session',
      'Are you sure you want to end this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End',
          style: 'destructive',
          onPress: async () => {
            if (sessionId) {
              await updateSession(sessionId, {
                endTime: new Date().toISOString(),
                completed: true,
              });
            }
            navigation.goBack();
          },
        },
      ]
    );
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.white }]}>
        <PurpleHeader title="Activity Session" showBack />
        <ActivityIndicator size="large" color={colors.purple.medium} />
      </View>
    );
  }

  if (!activity) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.white }]}>
        <PurpleHeader title="Activity Session" showBack />
        <Text style={[styles.errorText, { color: colors.text.secondary }]}>Activity not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title={activity.title} showBack />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {!sessionStarted ? (
          <>
            <View style={styles.previewSection}>
              <Text style={styles.previewIcon}>{activity.icon || '🎯'}</Text>
              <Text style={styles.previewTitle}>Ready to start?</Text>
              <Text style={styles.previewDescription}>{activity.description}</Text>
              {activity.duration && (
                <Text style={styles.previewDuration}>Recommended duration: {activity.duration} minutes</Text>
              )}
            </View>

            <TouchableOpacity style={styles.startButton} onPress={handleStartSession}>
              <Text style={styles.startButtonText}>Start Session</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Timer */}
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
              {activity.duration && (
                <Text style={styles.durationText}>
                  {Math.round((elapsedTime / (activity.duration * 60)) * 100)}% of recommended time
                </Text>
              )}
            </View>

            {/* Controls */}
            <View style={styles.controlsContainer}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setPaused(!paused)}
              >
                <Text style={styles.controlButtonText}>{paused ? '▶ Resume' : '⏸ Pause'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlButton, styles.endButton]}
                onPress={handleEndSession}
              >
                <Text style={[styles.controlButtonText, styles.endButtonText]}>End Session</Text>
              </TouchableOpacity>
            </View>

            {/* Instructions reminder */}
            {activity.instructions.length > 0 && (
              <View style={styles.instructionsSection}>
                <Text style={styles.instructionsTitle}>Remember:</Text>
                {activity.instructions.slice(0, 3).map((instruction, index) => (
                  <Text key={index} style={styles.instructionReminder}>
                    • {instruction}
                  </Text>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

// Styles factory function - colors must be provided at runtime
const makeStyles = (colors: ColorScheme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
    alignItems: 'center',
  },
  previewSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  previewIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  previewDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  previewDuration: {
    fontSize: 14,
    color: colors.text.light,
  },
  startButton: {
    backgroundColor: colors.purple.medium,
    padding: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  startButtonText: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: '600',
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: colors.purple.medium,
    marginBottom: 12,
  },
  durationText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 40,
  },
  controlButton: {
    flex: 1,
    backgroundColor: colors.purple.light,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  controlButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  endButton: {
    backgroundColor: colors.status.error,
  },
  endButtonText: {
    color: colors.text.white,
  },
  instructionsSection: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 20,
    width: '100%',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  instructionReminder: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 8,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 40,
  },
});
