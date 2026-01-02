import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Circle } from 'react-native-svg';
import { HomeStackParamList } from '../../navigation/types';
import { useAuth } from '../../hooks/useAuth';
import { useMood } from '../../hooks/useMood';
import { useJournal } from '../../hooks/useJournal';
import { useActivities } from '../../hooks/useActivities';
import { useBooking } from '../../hooks/useBooking';
import { useTheme } from '../../context/ThemeContext';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

// Circular Progress Component
const CircularProgress: React.FC<{ percentage: number; onPress: () => void }> = ({ percentage, onPress }) => {
  const { colors } = useTheme();
  const size = 200;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <TouchableOpacity
      style={styles.progressCircleContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.background.gray}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.purple.medium}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.progressTextContainer}>
        <Text style={[styles.progressPercentage, { color: colors.text.primary }]}>{percentage}%</Text>
        <Text style={[styles.progressLabel, { color: colors.text.secondary }]}>goal achieved!</Text>
      </View>
    </TouchableOpacity>
  );
};

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const { entries: moodEntries, loading: moodLoading, refreshEntries } = useMood();
  const { entries: journalEntries } = useJournal();
  const { sessions: activitySessions } = useActivities();
  const { bookings } = useBooking();
  const [showProgressDetails, setShowProgressDetails] = useState(false);
  const { colors } = useTheme();

  // Handle navigation based on step ID
  const handleStepPress = (stepId: string) => {
    setShowProgressDetails(false); // Close modal first
    
    // Wait a bit for modal animation
    setTimeout(() => {
      switch (stepId) {
        case 'username':
        case 'email':
        case 'profile_complete':
          // Navigate to Profile tab, then to EditProfile
          navigation.getParent()?.getParent()?.navigate('ProfileTab', {
            screen: 'EditProfile',
          });
          break;
        case 'first_mood':
        case 'multiple_moods':
          // Navigate to MoodEntry
          navigation.navigate('MoodEntry');
          break;
        case 'first_journal':
        case 'multiple_journals':
          // Navigate to Journal tab, then to JournalEntry
          navigation.getParent()?.getParent()?.navigate('JournalTab', {
            screen: 'JournalEntry',
            params: { entryId: undefined },
          });
          break;
        case 'first_activity':
        case 'multiple_activities':
          // Activities screen is not in tabs, show message or navigate to Resources
          // For now, navigate to Resources tab where activities might be accessible
          navigation.getParent()?.getParent()?.navigate('ResourcesTab');
          break;
        case 'first_booking':
          // Navigate to Resources tab, then to TherapistList
          navigation.getParent()?.getParent()?.navigate('ResourcesTab', {
            screen: 'TherapistList',
          });
          break;
        default:
          break;
      }
    }, 300);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshEntries();
    });
    return unsubscribe;
  }, [navigation, refreshEntries]);

  // Calculate profile completion details and percentage
  const progressDetails = useMemo(() => {
    if (!user) {
      return {
        percentage: 0,
        steps: [],
      };
    }

    const completedActivities = activitySessions.filter(s => s.completed);
    const steps = [
      {
        id: 'username',
        label: 'Username',
        completed: !!(user.username && user.username.trim()),
        percentage: 10,
      },
      {
        id: 'email',
        label: 'Email',
        completed: !!(user.email && user.email.trim()),
        percentage: 10,
      },
      {
        id: 'first_mood',
        label: 'First mood entry',
        completed: moodEntries.length > 0,
        percentage: 10,
      },
      {
        id: 'multiple_moods',
        label: 'Multiple mood entries (3+)',
        completed: moodEntries.length >= 3,
        percentage: 10,
      },
      {
        id: 'first_journal',
        label: 'First journal entry',
        completed: journalEntries.length > 0,
        percentage: 10,
      },
      {
        id: 'multiple_journals',
        label: 'Multiple journal entries (3+)',
        completed: journalEntries.length >= 3,
        percentage: 10,
      },
      {
        id: 'first_activity',
        label: 'First activity session',
        completed: completedActivities.length > 0,
        percentage: 10,
      },
      {
        id: 'multiple_activities',
        label: 'Multiple activity sessions (3+)',
        completed: completedActivities.length >= 3,
        percentage: 10,
      },
      {
        id: 'first_booking',
        label: 'First appointment',
        completed: bookings.length > 0,
        percentage: 10,
      },
      {
        id: 'profile_complete',
        label: 'Profile fully set up',
        completed: !!(user.username && user.email),
        percentage: 10,
      },
    ];

    const completedSteps = steps.filter(s => s.completed).length;
    const percentage = Math.round((completedSteps / steps.length) * 100);

    return { percentage, steps };
  }, [user, moodEntries.length, journalEntries.length, activitySessions.length, bookings.length]);

  const { percentage: profileCompletion, steps: progressSteps } = progressDetails;

  if (moodLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.white }]}>
        <ActivityIndicator size="large" color={colors.purple.medium} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.lightGray }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.purple.light }]}>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Dashboard</Text>
        <TouchableOpacity
          style={styles.messageIcon}
          onPress={() => {
            // Navigate to Community Chat - go up to MainNavigator
            const mainNav = navigation.getParent()?.getParent();
            if (mainNav) {
              (mainNav as any).navigate('CommunityChat');
            }
          }}
        >
          <Text style={styles.messageIconText}>💬</Text>
        </TouchableOpacity>
      </View>

      {/* Welcome Section */}
      <View style={[styles.welcomeSection, { backgroundColor: colors.purple.light }]}>
        <View style={styles.welcomeTextContainer}>
          <Text style={[styles.welcomeText, { color: colors.text.white }]}>Welcome,</Text>
          <Text style={[styles.userName, { color: colors.text.white }]}>{user?.username || 'Guest'}</Text>
        </View>
        <View style={styles.characterIllustration}>
          <Text style={styles.characterEmoji}>🧠</Text>
        </View>
      </View>

      {/* Progress Indicator - Profile Completion */}
      <View style={styles.progressWrapper}>
        <CircularProgress
          percentage={profileCompletion}
          onPress={() => setShowProgressDetails(true)}
        />
      </View>

      {/* Progress Details Modal */}
      <Modal
        visible={showProgressDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProgressDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background.white }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.background.lightGray }]}>
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>Profile Completion Details</Text>
              <TouchableOpacity
                onPress={() => setShowProgressDetails(false)}
                style={styles.closeButton}
              >
                <Text style={[styles.closeButtonText, { color: colors.text.secondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={[styles.progressSummary, { backgroundColor: colors.purple.light }]}>
                <Text style={[styles.summaryPercentage, { color: colors.purple.darker }]}>{profileCompletion}%</Text>
                <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Completed</Text>
              </View>

              <View style={styles.stepsContainer}>
                {progressSteps.map((step) => (
                  <View key={step.id} style={[styles.stepRow, { backgroundColor: colors.background.lightGray }]}>
                    <View style={styles.stepLeft}>
                      <Text style={[styles.stepIcon, { color: colors.purple.medium }]}>{step.completed ? '✓' : '○'}</Text>
                      <Text
                        style={[
                          styles.stepLabel,
                          { color: colors.text.secondary },
                          step.completed && { color: colors.text.primary, fontWeight: '600' },
                        ]}
                      >
                        {step.label}
                      </Text>
                    </View>
                    <View style={styles.stepRight}>
                      <Text
                        style={[
                          styles.stepPercentage,
                          { color: colors.text.secondary },
                          step.completed && { color: colors.purple.medium },
                        ]}
                      >
                        {step.percentage}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.purple.medium }]}
          onPress={() => navigation.navigate('MoodEntry')}
        >
          <Text style={styles.actionButtonText}>Today's exercise</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.purple.medium }]}
          onPress={() => {
            navigation.getParent()?.navigate('ResourcesTab');
          }}
        >
          <Text style={styles.actionButtonText}>Make an appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.purple.medium }]}
          onPress={() => navigation.navigate('MoodHistory')}
        >
          <Text style={styles.actionButtonText}>Tracking and rewards</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  messageIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageIconText: {
    fontSize: 20,
    color: '#333333',
  },
  welcomeSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  characterIllustration: {
    marginLeft: 20,
  },
  characterEmoji: {
    fontSize: 80,
  },
  progressWrapper: {
    alignItems: 'center',
    marginVertical: 40,
  },
  progressCircleContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  progressTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
  },
  progressPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressLabel: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  actionButton: {
    padding: 18,
    borderRadius: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: '300',
  },
  modalBody: {
    padding: 20,
  },
  progressSummary: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    borderRadius: 16,
  },
  summaryPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 16,
    marginTop: 4,
  },
  stepsContainer: {
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  stepLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepIcon: {
    fontSize: 20,
    marginRight: 12,
    fontWeight: 'bold',
  },
  stepLabel: {
    fontSize: 16,
    flex: 1,
  },
  stepLabelCompleted: {
    fontWeight: '600',
  },
  stepRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  stepPercentage: {
    fontSize: 16,
    fontWeight: '600',
  },
  stepPercentageCompleted: {
  },
  stepArrow: {
    fontSize: 20,
    marginLeft: 8,
    fontWeight: '300',
  },
});
