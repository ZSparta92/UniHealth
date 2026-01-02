import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { useMood } from '../../hooks/useMood';
import { MoodEntry } from '../../models/Mood';
import { colors } from '../../theme';
import { BackButton } from '../../components/common/BackButton';

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
  return (
    <TouchableOpacity
      style={styles.entryItem}
      onPress={() => onPress(entry.id)}
    >
      <View style={styles.entryLeft}>
        <Text style={styles.entryEmoji}>{MOOD_EMOJI_MAP[entry.mood] || '😐'}</Text>
        <View style={styles.entryInfo}>
          <Text style={styles.entryMood}>{getMoodDisplayName(entry.mood)}</Text>
          <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
        </View>
      </View>
      <View style={styles.entryRight}>
        <Text style={styles.entryIntensity}>Intensity: {entry.intensity}/10</Text>
      </View>
    </TouchableOpacity>
  );
};

export const MoodHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const { entries, loading, refreshEntries } = useMood();

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
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.brandTitle}>UniHealth</Text>
          <Text style={styles.brandSubtitle}>Because your mental well-being matters.</Text>
          <Text style={styles.screenTitle}>Mood History</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No mood entries yet</Text>
          <Text style={styles.emptySubtext}>Start tracking your mood to see your history here</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('MoodEntry')}
          >
            <Text style={styles.emptyButtonText}>Add First Entry</Text>
          </TouchableOpacity>
        </View>
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
        <Text style={styles.screenTitle}>Mood History</Text>
        <Text style={styles.screenSubtitle}>{entries.length} entries</Text>
      </View>

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
  backButton: {
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    color: colors.text.white,
    fontWeight: '500',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.purple.darker,
    textAlign: 'center',
    marginBottom: 2,
  },
  brandSubtitle: {
    fontSize: 9,
    color: colors.purple.darker,
    textAlign: 'center',
    marginBottom: 4,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.white,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    color: colors.text.white,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  entryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.card,
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
    color: colors.text.primary,
  },
  entryDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  entryRight: {
    alignItems: 'flex-end',
  },
  entryIntensity: {
    fontSize: 14,
    color: colors.text.secondary,
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
