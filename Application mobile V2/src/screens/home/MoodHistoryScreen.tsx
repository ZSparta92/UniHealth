import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { useMood } from '../../hooks/useMood';
import { MoodEntry } from '../../models/Mood';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type MoodHistoryScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'MoodHistory'>;

interface Props {
  navigation: MoodHistoryScreenNavigationProp;
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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      hour: 'numeric',
      minute: '2-digit',
    });
  }
};

const MoodEntryItem: React.FC<{
  entry: MoodEntry;
  onPress: (entryId: string) => void;
}> = ({ entry, onPress }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.entryItem, { backgroundColor: colors.background.card }]}
      onPress={() => onPress(entry.id)}
    >
      <View style={styles.entryLeft}>
        <Text style={styles.entryEmoji}>{MOOD_EMOJI_MAP[entry.mood] || '😐'}</Text>
        <View style={styles.entryInfo}>
          <Text style={[styles.entryMood, { color: colors.text.primary }]}>{getMoodDisplayName(entry.mood)}</Text>
          <Text style={[styles.entryDate, { color: colors.text.secondary }]}>{formatDate(entry.date)}</Text>
        </View>
      </View>
      <View style={styles.entryRight}>
        <Text style={[styles.entryIntensity, { color: colors.text.secondary }]}>Intensity: {entry.intensity}/10</Text>
      </View>
    </TouchableOpacity>
  );
};

export const MoodHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const { entries, loading, refreshEntries } = useMood();
  const { colors } = useTheme();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshEntries();
    });
    return unsubscribe;
  }, [navigation, refreshEntries]);

  const handleEntryPress = (entryId: string) => {
    navigation.navigate('MoodDetail', { moodId: entryId });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.purple.medium} />
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.white }]}>
        <PurpleHeader title="Mood History" showBack />
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text.primary }]}>No mood entries yet</Text>
          <Text style={[styles.emptySubtext, { color: colors.text.secondary }]}>Start tracking your mood to see your history here</Text>
          <TouchableOpacity
            style={[styles.emptyButton, { backgroundColor: colors.purple.medium }]}
            onPress={() => navigation.navigate('MoodEntry')}
          >
            <Text style={[styles.emptyButtonText, { color: colors.text.white }]}>Add First Entry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="Mood History" showBack />

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MoodEntryItem entry={item} onPress={handleEntryPress} />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  entryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  entryEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  entryInfo: {
    flex: 1,
  },
  entryMood: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  entryDate: {
    fontSize: 14,
  },
  entryRight: {
    alignItems: 'flex-end',
  },
  entryIntensity: {
    fontSize: 14,
    fontWeight: '500',
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
