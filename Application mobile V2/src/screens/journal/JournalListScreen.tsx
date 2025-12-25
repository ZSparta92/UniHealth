import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JournalStackParamList } from '../../navigation/types';
import { useJournal } from '../../hooks/useJournal';
import { JournalEntry } from '../../models/Journal';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type JournalListScreenNavigationProp = NativeStackNavigationProp<JournalStackParamList, 'JournalList'>;

interface Props {
  navigation: JournalListScreenNavigationProp;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  }
};

const JournalEntryItem: React.FC<{
  entry: JournalEntry;
  onPress: (entryId: string) => void;
}> = ({ entry, onPress }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.entryItem, { backgroundColor: colors.background.card }]}
      onPress={() => onPress(entry.id)}
    >
      <View style={styles.entryHeader}>
        <Text style={[styles.entryTitle, { color: colors.text.primary }]}>{entry.title || 'Untitled'}</Text>
        {entry.isFavorite && <Text style={styles.favoriteIcon}>⭐</Text>}
      </View>
      <Text style={[styles.entryPreview, { color: colors.text.secondary }]} numberOfLines={2}>
        {entry.content || 'No content'}
      </Text>
      <View style={styles.entryFooter}>
        <Text style={[styles.entryDate, { color: colors.text.secondary }]}>{formatDate(entry.date)}</Text>
        {entry.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {entry.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: colors.purple.light }]}>
                <Text style={[styles.tagText, { color: colors.purple.darker }]}>{tag}</Text>
              </View>
            ))}
            {entry.tags.length > 2 && (
              <Text style={[styles.moreTags, { color: colors.text.secondary }]}>+{entry.tags.length - 2}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const JournalListScreen: React.FC<Props> = ({ navigation }) => {
  const { entries, loading, refreshEntries } = useJournal();
  const { colors } = useTheme();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshEntries();
    });
    return unsubscribe;
  }, [navigation, refreshEntries]);

  const handleEntryPress = (entryId: string) => {
    navigation.navigate('JournalDetail', { entryId });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.white }]}>
        <PurpleHeader title="Journal" />
        <ActivityIndicator size="large" color={colors.purple.medium} style={styles.loader} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="Journal" />
      
      {/* Action Buttons */}
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.purple.medium }]}
          onPress={() => navigation.navigate('JournalEntry')}
        >
          <Text style={[styles.addButtonText, { color: colors.text.white }]}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: colors.purple.medium }]}
          onPress={() => navigation.navigate('JournalSearch')}
        >
          <Text style={[styles.searchButtonText, { color: colors.text.white }]}>🔍 Search</Text>
        </TouchableOpacity>
      </View>

      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text.primary }]}>No journal entries yet</Text>
          <Text style={[styles.emptySubtext, { color: colors.text.secondary }]}>Start writing to see your entries here</Text>
          <TouchableOpacity
            style={[styles.emptyButton, { backgroundColor: colors.purple.medium }]}
            onPress={() => navigation.navigate('JournalEntry')}
          >
            <Text style={[styles.emptyButtonText, { color: colors.text.white }]}>Write First Entry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JournalEntryItem entry={item} onPress={handleEntryPress} />
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
    gap: 12,
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
  searchButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  searchButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  entryItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  favoriteIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
  entryPreview: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryDate: {
    fontSize: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 6,
  },
  tagText: {
    fontSize: 12,
  },
  moreTags: {
    fontSize: 12,
    marginLeft: 6,
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
