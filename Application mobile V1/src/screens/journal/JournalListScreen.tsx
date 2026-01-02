import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JournalStackParamList } from '../../navigation/types';
import { useJournal } from '../../hooks/useJournal';
import { JournalEntry } from '../../models/Journal';
import { colors } from '../../theme';

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
  return (
    <TouchableOpacity
      style={styles.entryItem}
      onPress={() => onPress(entry.id)}
    >
      <View style={styles.entryHeader}>
        <Text style={styles.entryTitle}>{entry.title || 'Untitled'}</Text>
        {entry.isFavorite && <Text style={styles.favoriteIcon}>⭐</Text>}
      </View>
      <Text style={styles.entryPreview} numberOfLines={2}>
        {entry.content || 'No content'}
      </Text>
      <View style={styles.entryFooter}>
        <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
        {entry.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {entry.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {entry.tags.length > 2 && (
              <Text style={styles.moreTags}>+{entry.tags.length - 2}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const JournalListScreen: React.FC<Props> = ({ navigation }) => {
  const { entries, loading, refreshEntries } = useJournal();

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
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.brandTitle}>UniHealth</Text>
          <Text style={styles.brandSubtitle}>Because your mental well-being matters.</Text>
          <TouchableOpacity style={styles.profileIcon}>
            <Text style={styles.profileIconText}>👤</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Journal</Text>
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
          <Text style={styles.screenTitle}>Journal</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('JournalEntry')}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('JournalSearch')}
        >
          <Text style={styles.searchButtonText}>🔍 Search</Text>
        </TouchableOpacity>
      </View>

      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No journal entries yet</Text>
          <Text style={styles.emptySubtext}>Start writing to see your entries here</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('JournalEntry')}
          >
            <Text style={styles.emptyButtonText}>Write First Entry</Text>
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
    marginBottom: 12,
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
  searchButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.background.white,
  },
  searchButtonText: {
    fontSize: 14,
    color: colors.text.primary,
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
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
  },
  favoriteIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
  entryPreview: {
    fontSize: 14,
    color: colors.text.secondary,
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
    color: colors.text.light,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: colors.purple.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 6,
  },
  tagText: {
    fontSize: 12,
    color: colors.text.primary,
  },
  moreTags: {
    fontSize: 12,
    color: colors.text.light,
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
