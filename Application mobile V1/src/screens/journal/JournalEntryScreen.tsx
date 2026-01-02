import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JournalStackParamList } from '../../navigation/types';
import { useJournal } from '../../hooks/useJournal';
import { colors } from '../../theme';
import { BackButton } from '../../components/common/BackButton';

type JournalEntryScreenRouteProp = RouteProp<JournalStackParamList, 'JournalEntry'>;
type JournalEntryScreenNavigationProp = NativeStackNavigationProp<JournalStackParamList, 'JournalEntry'>;

interface Props {
  route: JournalEntryScreenRouteProp;
  navigation: JournalEntryScreenNavigationProp;
}

export const JournalEntryScreen: React.FC<Props> = ({ route, navigation }) => {
  const { entryId } = route.params || {};
  const { createEntry, updateEntry, getEntryById } = useJournal();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (entryId) {
      loadEntry();
    }
  }, [entryId]);

  const loadEntry = async () => {
    if (!entryId) return;
    
    setLoading(true);
    try {
      const entry = await getEntryById(entryId);
      if (entry) {
        setTitle(entry.title);
        setContent(entry.content);
        setTags(entry.tags || []);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load journal entry');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Error', 'Please enter a title or content');
      return;
    }

    setSaving(true);
    try {
      if (entryId) {
        await updateEntry(entryId, {
          title: title.trim() || 'Untitled',
          content: content.trim(),
          tags,
        });
      } else {
        await createEntry(
          title.trim() || 'Untitled',
          content.trim(),
          tags
        );
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save journal entry');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.purple.medium} />
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
        <Text style={styles.screenTitle}>{entryId ? 'Edit Entry' : 'New Entry'}</Text>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Title Input */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.titleInput}
            placeholder="Title (optional)"
            placeholderTextColor={colors.text.light}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* Content Input */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.contentInput}
            placeholder="Write your thoughts here..."
            placeholderTextColor={colors.text.light}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Tags Section */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionLabel}>Tags</Text>
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              placeholder="Add a tag"
              placeholderTextColor={colors.text.light}
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={handleAddTag}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addTagButton} onPress={handleAddTag}>
              <Text style={styles.addTagButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.tag}
                  onPress={() => handleRemoveTag(tag)}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                  <Text style={styles.tagRemove}>×</Text>
                </TouchableOpacity>
              ))}
            </View>
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
    marginBottom: 12,
  },
  saveButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: colors.purple.medium,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  inputSection: {
    marginBottom: 24,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.gray,
  },
  contentInput: {
    fontSize: 16,
    color: colors.text.primary,
    minHeight: 200,
    paddingVertical: 12,
    lineHeight: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.background.gray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: colors.text.primary,
    marginRight: 8,
  },
  addTagButton: {
    backgroundColor: colors.purple.light,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addTagButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.purple.light,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: colors.text.primary,
    marginRight: 6,
  },
  tagRemove: {
    fontSize: 18,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
});
