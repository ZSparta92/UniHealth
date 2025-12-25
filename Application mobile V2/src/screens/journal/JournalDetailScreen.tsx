import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JournalStackParamList } from '../../navigation/types';
import { useJournal } from '../../hooks/useJournal';
import { JournalEntry } from '../../models/Journal';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type JournalDetailScreenRouteProp = RouteProp<JournalStackParamList, 'JournalDetail'>;
type JournalDetailScreenNavigationProp = NativeStackNavigationProp<JournalStackParamList, 'JournalDetail'>;

interface Props {
  route: JournalDetailScreenRouteProp;
  navigation: JournalDetailScreenNavigationProp;
}

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

export const JournalDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { entryId } = route.params;
  const { getEntryById, deleteEntry, toggleFavorite } = useJournal();
  const { colors } = useTheme();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntry();
  }, [entryId]);

  const loadEntry = async () => {
    try {
      setLoading(true);
      const journalEntry = await getEntryById(entryId);
      setEntry(journalEntry);
    } catch (error) {
      console.error('Error loading journal entry:', error);
      Alert.alert('Error', 'Failed to load journal entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteEntry(entryId);
            if (success) {
              navigation.goBack();
            } else {
              Alert.alert('Error', 'Failed to delete entry');
            }
          },
        },
      ]
    );
  };

  const handleToggleFavorite = async () => {
    await toggleFavorite(entryId);
    await loadEntry(); // Reload to update favorite state
  };

  const handleEdit = () => {
    navigation.navigate('JournalEntry', { entryId });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.purple.medium} />
      </View>
    );
  }

  if (!entry) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Entry not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title={entry.title || 'Journal Entry'} showBack />
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleToggleFavorite}>
          <Text style={styles.favoriteIcon}>{entry.isFavorite ? '⭐' : '☆'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Text style={[styles.title, { color: colors.text.primary }]}>{entry.title || 'Untitled'}</Text>

        {/* Date */}
        <Text style={[styles.date, { color: colors.text.secondary }]}>{formatDate(entry.date)}</Text>

        {/* Tags */}
        {entry.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {entry.tags.map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: colors.purple.light }]}>
                <Text style={[styles.tagText, { color: colors.text.primary }]}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Content */}
        <View style={[styles.contentBox, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.contentText, { color: colors.text.primary }]}>{entry.content}</Text>
        </View>

        {/* Metadata */}
        <View style={[styles.metadata, { borderTopColor: colors.background.gray }]}>
          <Text style={[styles.metadataText, { color: colors.text.secondary }]}>{entry.wordCount} words</Text>
        </View>
      </ScrollView>
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
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  editIcon: {
    fontSize: 24,
  },
  deleteIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
  },
  contentBox: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  metadata: {
    paddingTop: 16,
    borderTopWidth: 1,
  },
  metadataText: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
