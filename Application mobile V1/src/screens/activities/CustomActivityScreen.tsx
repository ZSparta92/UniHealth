import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivitiesStackParamList } from '../../navigation/types';
import { useActivities } from '../../hooks/useActivities';
import { Activity, ActivityCategory, ActivityDifficulty } from '../../models/Activity';
import { colors } from '../../theme';
import { BackButton } from '../../components/common/BackButton';

type CustomActivityScreenRouteProp = RouteProp<ActivitiesStackParamList, 'CustomActivity'>;
type CustomActivityScreenNavigationProp = NativeStackNavigationProp<ActivitiesStackParamList, 'CustomActivity'>;

interface Props {
  route: CustomActivityScreenRouteProp;
  navigation: CustomActivityScreenNavigationProp;
}

const CATEGORIES: ActivityCategory[] = ['meditation', 'breathing', 'exercise', 'gratitude', 'mindfulness', 'creative', 'social', 'self_care', 'other'];
const DIFFICULTIES: ActivityDifficulty[] = ['easy', 'medium', 'hard'];

export const CustomActivityScreen: React.FC<Props> = ({ route, navigation }) => {
  const { activityId } = route.params || {};
  const { getActivityById, createCustomActivity, updateCustomActivity } = useActivities();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('other');
  const [difficulty, setDifficulty] = useState<ActivityDifficulty>('easy');
  const [duration, setDuration] = useState('');
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [benefits, setBenefits] = useState<string[]>(['']);
  const [icon, setIcon] = useState('🎯');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activityId) {
      loadActivity();
    }
  }, [activityId]);

  const loadActivity = async () => {
    try {
      setLoading(true);
      const activity = await getActivityById(activityId);
      if (activity && activity.isCustom) {
        setTitle(activity.title);
        setDescription(activity.description);
        setCategory(activity.category);
        setDifficulty(activity.difficulty);
        setDuration(activity.duration?.toString() || '');
        setInstructions(activity.instructions.length > 0 ? activity.instructions : ['']);
        setBenefits(activity.benefits.length > 0 ? activity.benefits : ['']);
        setIcon(activity.icon || '🎯');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load activity');
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const handleUpdateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const handleRemoveInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, '']);
  };

  const handleUpdateBenefit = (index: number, value: string) => {
    const updated = [...benefits];
    updated[index] = value;
    setBenefits(updated);
  };

  const handleRemoveBenefit = (index: number) => {
    if (benefits.length > 1) {
      setBenefits(benefits.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    try {
      setLoading(true);
      const filteredInstructions = instructions.filter((i) => i.trim());
      const filteredBenefits = benefits.filter((b) => b.trim());

      const activityData = {
        title: title.trim(),
        description: description.trim(),
        category,
        difficulty,
        duration: duration ? parseInt(duration, 10) : undefined,
        instructions: filteredInstructions,
        benefits: filteredBenefits,
        icon,
      };

      if (activityId) {
        await updateCustomActivity(activityId, activityData);
      } else {
        await createCustomActivity(activityData);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save activity');
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.screenTitle}>{activityId ? 'Edit Activity' : 'Create Activity'}</Text>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Activity title"
            placeholderTextColor={colors.text.light}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* Description */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the activity"
            placeholderTextColor={colors.text.light}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Icon */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Icon</Text>
          <TextInput
            style={styles.input}
            placeholder="🎯"
            placeholderTextColor={colors.text.light}
            value={icon}
            onChangeText={setIcon}
            maxLength={2}
          />
        </View>

        {/* Category */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, category === cat && styles.categoryChipSelected]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.categoryChipText, category === cat && styles.categoryChipTextSelected]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Difficulty */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Difficulty</Text>
          <View style={styles.difficultyContainer}>
            {DIFFICULTIES.map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[styles.difficultyChip, difficulty === diff && styles.difficultyChipSelected]}
                onPress={() => setDifficulty(diff)}
              >
                <Text style={[styles.difficultyChipText, difficulty === diff && styles.difficultyChipTextSelected]}>
                  {diff}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Duration */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Duration (minutes, optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 10"
            placeholderTextColor={colors.text.light}
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
          />
        </View>

        {/* Instructions */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Instructions</Text>
          {instructions.map((instruction, index) => (
            <View key={index} style={styles.listItem}>
              <TextInput
                style={[styles.input, styles.listInput]}
                placeholder={`Step ${index + 1}`}
                placeholderTextColor={colors.text.light}
                value={instruction}
                onChangeText={(value) => handleUpdateInstruction(index, value)}
              />
              {instructions.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveInstruction(index)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={handleAddInstruction}>
            <Text style={styles.addButtonText}>+ Add Instruction</Text>
          </TouchableOpacity>
        </View>

        {/* Benefits */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Benefits</Text>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.listItem}>
              <TextInput
                style={[styles.input, styles.listInput]}
                placeholder="Benefit"
                placeholderTextColor={colors.text.light}
                value={benefit}
                onChangeText={(value) => handleUpdateBenefit(index, value)}
              />
              {benefits.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveBenefit(index)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={handleAddBenefit}>
            <Text style={styles.addButtonText}>+ Add Benefit</Text>
          </TouchableOpacity>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.background.gray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background.white,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryScroll: {
    marginTop: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.background.lightGray,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.background.gray,
  },
  categoryChipSelected: {
    backgroundColor: colors.purple.light,
    borderColor: colors.purple.medium,
  },
  categoryChipText: {
    fontSize: 14,
    color: colors.text.primary,
    textTransform: 'capitalize',
  },
  categoryChipTextSelected: {
    fontWeight: '600',
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  difficultyChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.background.lightGray,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.background.gray,
  },
  difficultyChipSelected: {
    backgroundColor: colors.purple.light,
    borderColor: colors.purple.medium,
  },
  difficultyChipText: {
    fontSize: 14,
    color: colors.text.primary,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  difficultyChipTextSelected: {
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listInput: {
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.status.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 20,
    color: colors.text.white,
    fontWeight: 'bold',
  },
  addButton: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.purple.light,
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
