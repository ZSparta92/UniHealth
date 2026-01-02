import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JournalStackParamList } from '../../navigation/types';
import { useJournal } from '../../hooks/useJournal';
import { JournalEntry, JournalSearchFilters } from '../../models/Journal';
import { colors } from '../../theme';
import { BackButton } from '../../components/common/BackButton';

type JournalSearchScreenNavigationProp = NativeStackNavigationProp<JournalStackParamList, 'JournalSearch'>;

interface Props {
  navigation: JournalSearchScreenNavigationProp;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });
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
      <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
    </TouchableOpacity>
  );
};

export const JournalSearchScreen: React.FC<Props> = ({ navigation }) => {
  const { searchEntries, getAllTags } = useJournal();
  const [searchText, setSearchText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [results, setResults] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    performSearch();
  }, [searchText, selectedTags, favoritesOnly]);

  const loadTags = async () => {
    const tags = await getAllTags();
    setAvailableTags(tags);
  };

  const performSearch = async () => {
    setLoading(true);
    try {
      const filters: JournalSearchFilters = {
        searchText: searchText.trim() || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        favoritesOnly: favoritesOnly || undefined,
      };
      const searchResults = await searchEntries(filters);
      setResults(searchResults);
    } catch (error) {
      console.error('Error searching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleEntryPress = (entryId: string) => {
    navigation.navigate('JournalDetail', { entryId });
  };

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
        <Text style={styles.screenTitle}>Search Journal</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Search Input */}
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search entries..."
            placeholderTextColor={colors.text.light}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Filters */}
        <View style={styles.filtersSection}>
          <TouchableOpacity
            style={[styles.filterButton, favoritesOnly && styles.filterButtonActive]}
            onPress={() => setFavoritesOnly(!favoritesOnly)}
          >
            <Text style={[styles.filterButtonText, favoritesOnly && styles.filterButtonTextActive]}>
              ⭐ Favorites Only
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tags */}
        {availableTags.length > 0 && (
          <View style={styles.tagsSection}>
            <Text style={styles.sectionLabel}>Filter by tags:</Text>
            <View style={styles.tagsContainer}>
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tag, isSelected && styles.tagSelected]}
                    onPress={() => handleTagToggle(tag)}
                  >
                    <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Results */}
        <View style={styles.resultsSection}>
          <Text style={styles.resultsCount}>{results.length} result{results.length !== 1 ? 's' : ''}</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color={colors.purple.medium} style={styles.loader} />
          ) : results.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No results found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
            </View>
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <JournalEntryItem entry={item} onPress={handleEntryPress} />
              )}
              scrollEnabled={false}
            />
          )}
        </View>
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
  searchSection: {
    marginBottom: 24,
  },
  searchInput: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.background.gray,
  },
  filtersSection: {
    marginBottom: 24,
  },
  filterButton: {
    backgroundColor: colors.background.card,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.background.gray,
  },
  filterButtonActive: {
    backgroundColor: colors.purple.light,
    borderColor: colors.purple.medium,
  },
  filterButtonText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: colors.text.primary,
  },
  tagsSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.background.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.background.gray,
  },
  tagSelected: {
    backgroundColor: colors.purple.light,
    borderColor: colors.purple.medium,
  },
  tagText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  tagTextSelected: {
    fontWeight: '600',
  },
  resultsSection: {
    flex: 1,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 16,
  },
  loader: {
    marginVertical: 40,
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
    marginBottom: 8,
    lineHeight: 20,
  },
  entryDate: {
    fontSize: 12,
    color: colors.text.light,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});
