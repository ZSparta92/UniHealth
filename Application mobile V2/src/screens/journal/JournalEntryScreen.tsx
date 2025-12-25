import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JournalStackParamList } from '../../navigation/types';
import { useJournal } from '../../hooks/useJournal';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';
import { SubmitButton } from '../../components/common/SubmitButton';

type JournalEntryScreenRouteProp = RouteProp<JournalStackParamList, 'JournalEntry'>;
type JournalEntryScreenNavigationProp = NativeStackNavigationProp<JournalStackParamList, 'JournalEntry'>;

interface Props {
  route: JournalEntryScreenRouteProp;
  navigation: JournalEntryScreenNavigationProp;
}

export const JournalEntryScreen: React.FC<Props> = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { entryId } = route.params || {};
  const { createEntry, updateEntry, getEntryById } = useJournal();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const titleInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);

  // Check if form is valid (title or content must be filled)
  const isFormValid = useMemo(() => {
    return title.trim().length > 0 || content.trim().length > 0;
  }, [title, content]);

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
      <View style={[styles.container, { backgroundColor: colors.background.white }]}>
        <ActivityIndicator size="large" color={colors.purple.medium} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background.white }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <PurpleHeader title={entryId ? 'Edit Entry' : 'Write it down'} showBack />
      
      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <SubmitButton
          title="Save"
          onPress={handleSave}
          disabled={!isFormValid}
          loading={saving}
          loadingText="Saving..."
          style={styles.saveButton}
        />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={true}
      >
        {/* Title Input */}
        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Title (optional)</Text>
          <TextInput
            ref={titleInputRef}
            style={[styles.titleInput, { color: colors.text.primary, borderBottomColor: colors.purple.light }]}
            placeholder="Give your entry a title..."
            placeholderTextColor={colors.text.light}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            returnKeyType="next"
            onSubmitEditing={() => contentInputRef.current?.focus()}
          />
        </View>

        {/* Content Input */}
        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Your thoughts</Text>
          <TextInput
            ref={contentInputRef}
            style={[styles.contentInput, { color: colors.text.primary, borderColor: colors.background.gray, backgroundColor: colors.background.white }]}
            placeholder="Write your thoughts here... Take your time, express yourself freely."
            placeholderTextColor={colors.text.light}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Tags Section */}
        <View style={styles.inputSection}>
          <Text style={[styles.sectionLabel, { color: colors.text.primary }]}>Tags</Text>
          <View style={styles.tagInputContainer}>
            <TextInput
              style={[styles.tagInput, { color: colors.text.primary, borderColor: colors.background.gray }]}
              placeholder="Add a tag"
              placeholderTextColor={colors.text.light}
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={handleAddTag}
              returnKeyType="done"
            />
            <TouchableOpacity style={[styles.addTagButton, { backgroundColor: colors.purple.light }]} onPress={handleAddTag}>
              <Text style={[styles.addTagButtonText, { color: colors.text.primary }]}>Add</Text>
            </TouchableOpacity>
          </View>
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.tag, { backgroundColor: colors.purple.light }]}
                  onPress={() => handleRemoveTag(tag)}
                >
                  <Text style={[styles.tagText, { color: colors.text.primary }]}>{tag}</Text>
                  <Text style={[styles.tagRemove, { color: colors.text.primary }]}>×</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  saveButtonContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    minHeight: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 150, // Extra padding for keyboard
  },
  inputSection: {
    marginBottom: 28,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 2,
  },
  contentInput: {
    fontSize: 16,
    minHeight: 250,
    paddingVertical: 16,
    paddingHorizontal: 12,
    lineHeight: 24,
    borderWidth: 1,
    borderRadius: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 8,
  },
  addTagButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addTagButtonText: {
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    marginRight: 6,
  },
  tagRemove: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
