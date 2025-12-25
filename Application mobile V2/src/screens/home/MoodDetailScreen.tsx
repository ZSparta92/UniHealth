import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { useMood } from '../../hooks/useMood';
import { MoodEntry } from '../../models/Mood';
import { useTheme, ColorScheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type MoodDetailScreenRouteProp = RouteProp<HomeStackParamList, 'MoodDetail'>;
type MoodDetailScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'MoodDetail'>;

interface Props {
  route: MoodDetailScreenRouteProp;
  navigation: MoodDetailScreenNavigationProp;
}

const MOOD_EMOJI_MAP: Record<string, string> = {
  very_happy: '😄',
  happy: '🙂',
  excited: '🤩',
  calm: '😌',
  neutral: '😐',
  tired: '😴',
  sad: '😢',
  very_sad: '😭',
  anxious: '😰',
  angry: '😠',
};

const getMoodDisplayName = (mood: string): string => {
  const moodMap: Record<string, string> = {
    very_happy: 'Very Happy',
    happy: 'Happy',
    neutral: 'Neutral',
    sad: 'Sad',
    very_sad: 'Very Sad',
    anxious: 'Anxious',
    angry: 'Angry',
    tired: 'Tired',
    excited: 'Excited',
    calm: 'Calm',
  };
  return moodMap[mood] || mood;
};

export const MoodDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { moodId } = route.params;
  const { getEntryById } = useMood();
  const { colors } = useTheme();
  const [entry, setEntry] = useState<MoodEntry | null>(null);
  const [loading, setLoading] = useState(true);

  // Create styles with theme colors
  const styles = useMemo(() => makeStyles(colors), [colors]);

  useEffect(() => {
    loadEntry();
  }, [moodId]);

  const loadEntry = async () => {
    try {
      setLoading(true);
      const moodEntry = await getEntryById(moodId);
      setEntry(moodEntry);
    } catch (error) {
      console.error('Error loading mood entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.white }]}>
        <PurpleHeader title="Mood Detail" showBack />
        <ActivityIndicator size="large" color={colors.purple.medium} />
      </View>
    );
  }

  if (!entry) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.white }]}>
        <PurpleHeader title="Mood Detail" showBack />
        <Text style={[styles.errorText, { color: colors.text.secondary }]}>Entry not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="Mood Detail" showBack />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.moodHeader}>
          <Text style={styles.moodEmoji}>{MOOD_EMOJI_MAP[entry.mood] || '😐'}</Text>
          <Text style={styles.moodName}>{getMoodDisplayName(entry.mood)}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Intensity</Text>
            <Text style={styles.detailValue}>{entry.intensity}/10</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>{formatDate(entry.date)}</Text>
          </View>

          {entry.notes && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Notes</Text>
              <Text style={styles.detailValue}>{entry.notes}</Text>
            </View>
          )}
        </View>
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
  },
  moodHeader: {
    alignItems: 'center',
    marginBottom: 40,
    paddingVertical: 20,
  },
  moodEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  moodName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  detailsContainer: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.gray,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 18,
    color: colors.text.primary,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 40,
  },
});
