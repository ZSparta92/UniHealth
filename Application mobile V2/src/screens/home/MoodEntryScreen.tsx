import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { useMood } from '../../hooks/useMood';
import { useAuth } from '../../hooks/useAuth';
import { MoodType } from '../../models/Mood';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';
import { SubmitButton } from '../../components/common/SubmitButton';

type MoodEntryScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'MoodEntry'>;

interface Props {
  navigation: MoodEntryScreenNavigationProp;
}

const MOOD_OPTIONS: { type: MoodType; emoji: string; label: string }[] = [
  { type: 'happy', emoji: '😊', label: 'Happy' },
  { type: 'sad', emoji: '😔', label: 'Sad' },
  { type: 'very_sad', emoji: '😢', label: 'Very Sad' },
  { type: 'neutral', emoji: '😴', label: 'Tired' },
];

export const MoodEntryScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [intensity, setIntensity] = useState<number>(5); // Default intensity
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { addEntry } = useMood();
  const { colors } = useTheme();

  const handleSave = async (skipNavigation = false) => {
    if (!selectedMood) {
      Alert.alert('Error', 'Please select a mood');
      return;
    }

    setLoading(true);
    try {
      await addEntry(selectedMood, intensity);
      if (!skipNavigation) {
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save mood entry');
    } finally {
      setLoading(false);
    }
  };

  const getSupportMessage = (mood?: MoodType) => {
    if (!mood) return '';
    if (mood === 'happy') return "It's great to see you feeling good today!";
    if (mood === 'sad') return "It's okay to feel this way. Consider talking to someone or writing down your thoughts.";
    if (mood === 'very_sad') return "You're not alone. Professional support can help. Would you like to connect with a psychologist?";
    if (mood === 'neutral') return "Feeling tired? Take a break, rest, hydrate, and stretch a bit.";
    return '';
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background.white }]} contentContainerStyle={styles.content}>
      {/* Privacy Banner */}
      <View style={[styles.privacyBanner, { backgroundColor: colors.background.lightGray }]}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={[styles.privacyText, { color: colors.text.secondary }]}>
          Privacy First: Your answers are stored only on your device, are anonymized, and never shared. You can delete them at any time.
        </Text>
      </View>

      {/* Header with Back Button */}
      <PurpleHeader title="Add Mood" showBack />

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={[styles.question, { color: colors.text.primary }]}>How do you feel today?</Text>

        {/* Mood Selection Grid - 2x2 */}
        <View style={styles.moodGrid}>
          {MOOD_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.type}
              style={[
                styles.moodButton,
                { borderColor: colors.background.gray },
                selectedMood === option.type && [
                  styles.moodButtonSelected,
                  { backgroundColor: colors.purple.light, borderColor: colors.purple.medium },
                ],
              ]}
              onPress={() => setSelectedMood(option.type)}
            >
              <Text style={styles.moodEmoji}>{option.emoji}</Text>
              <Text
                style={[
                  styles.moodLabel,
                  { color: colors.text.secondary },
                  selectedMood === option.type && { color: colors.purple.darker, fontWeight: '600' },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Support Message and Actions - Reduced spacing */}
        {selectedMood && (
          <>
            <View style={[styles.supportBox, { backgroundColor: colors.purple.light }]}>
              <Text style={[styles.supportText, { color: colors.text.primary }]}>{getSupportMessage(selectedMood)}</Text>
            </View>

            {/* Intensity Selection */}
            <View style={styles.intensitySection}>
              <Text style={[styles.intensityLabel, { color: colors.text.primary }]}>Intensity</Text>
              <View style={styles.intensityButtonsContainer}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.intensityButton,
                      { backgroundColor: colors.background.lightGray, borderColor: colors.purple.light },
                      intensity === value && { backgroundColor: colors.purple.medium, borderColor: colors.purple.darker },
                    ]}
                    onPress={() => setIntensity(value)}
                  >
                    <Text
                      style={[
                        styles.intensityButtonText,
                        { color: colors.text.primary },
                        intensity === value && { color: colors.text.white },
                      ]}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Submit Button */}
            <View style={styles.submitContainer}>
              <SubmitButton
                title="Confirm Mood"
                onPress={handleSave}
                disabled={!selectedMood}
                loading={loading}
                loadingText="Saving..."
                style={styles.submitButton}
              />
            </View>

            {/* Additional Actions */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.purple.light }]}
                disabled={loading}
                onPress={async () => {
                  // Save mood entry first, then navigate to journal
                  if (selectedMood) {
                    setLoading(true);
                    try {
                      await addEntry(selectedMood, intensity);
                      // Navigate to JournalEntry via tab navigator
                      (navigation.getParent()?.getParent() as any)?.navigate('JournalTab', {
                        screen: 'JournalEntry',
                        params: { entryId: undefined },
                      });
                    } catch (error) {
                      Alert.alert('Error', 'Failed to save mood entry');
                    } finally {
                      setLoading(false);
                    }
                  }
                }}
              >
                <Text style={styles.starIcon}>📝</Text>
                <Text style={[styles.actionButtonText, { color: colors.text.primary }]}>Write it down</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.purple.light }]}
                disabled={loading}
                onPress={async () => {
                  if (!selectedMood) return;
                  
                  // Save mood entry first
                  setLoading(true);
                  try {
                    await addEntry(selectedMood, intensity);
                    
                    if (selectedMood === 'happy') {
                      // Navigate to SavorMoment screen
                      navigation.navigate('SavorMoment');
                    } else {
                      // Navigate to therapist list for support
                      (navigation.getParent()?.getParent() as any)?.navigate('ResourcesTab', {
                        screen: 'TherapistList',
                      });
                    }
                  } catch (error) {
                    Alert.alert('Error', 'Failed to save mood entry');
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <Text style={styles.starIcon}>
                  {selectedMood === 'happy' ? '✨' : '💬'}
                </Text>
                <Text style={[styles.actionButtonText, { color: colors.text.primary }]}>
                  {selectedMood === 'happy' ? 'Savor the moment - 30 sec' : 'Need to talk with someone ?'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  privacyBanner: {
    flexDirection: 'row',
    padding: 12,
    paddingHorizontal: 16,
  },
  lockIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  privacyText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
  mainContent: {
    padding: 20,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  moodButton: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  moodButtonSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  moodEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  supportBox: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  supportText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  submitContainer: {
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 0,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  starIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  intensitySection: {
    marginBottom: 20,
  },
  intensityLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  intensityButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  intensityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  intensityButtonSelected: {
  },
  intensityButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  intensityButtonTextSelected: {
  },
});
