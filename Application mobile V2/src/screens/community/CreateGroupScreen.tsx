import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { useCommunityGroup } from '../../hooks/useCommunityGroup';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';
import { SubmitButton } from '../../components/common/SubmitButton';

type CreateGroupScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'CreateGroup'>;

interface Props {
  navigation: CreateGroupScreenNavigationProp;
}

const THEME_SUGGESTIONS = [
  'Anxiety Management',
  'Study Stress',
  'Social Connections',
  'Time Management',
  'Sleep & Wellness',
  'Exam Preparation',
  'Career Guidance',
  'Self-Care Practices',
];

export const CreateGroupScreen: React.FC<Props> = ({ navigation }) => {
  const { createGroup, userIsPsychologist } = useCommunityGroup();
  const { colors } = useTheme();
  const [theme, setTheme] = useState('');
  const [description, setDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState<6 | 7>(6);
  const [loading, setLoading] = useState(false);

  // Check if user is psychologist
  if (!userIsPsychologist) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.white }]}>
        <PurpleHeader title="Create Group" showBack />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text.primary }]}>Access Restricted</Text>
          <Text style={[styles.errorSubtext, { color: colors.text.secondary }]}>
            Only licensed psychologists can create supervised groups.
          </Text>
        </View>
      </View>
    );
  }

  const handleCreate = async () => {
    if (!theme.trim()) {
      Alert.alert('Error', 'Please enter a theme for the group');
      return;
    }

    setLoading(true);
    try {
      const newGroup = await createGroup(theme.trim(), description.trim() || undefined, maxMembers);
      if (newGroup) {
        Alert.alert(
          'Group Created',
          `Group "${newGroup.code}" has been created successfully!`,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeSuggestion = (suggestion: string) => {
    setTheme(suggestion);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="Create Group" showBack />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Information Banner */}
        <View style={[styles.infoBanner, { backgroundColor: colors.purple.light, borderColor: colors.purple.medium }]}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: colors.text.primary }]}>Supervised Group Guidelines</Text>
            <Text style={[styles.infoText, { color: colors.text.secondary }]}>
              • Groups are limited to 6-7 students{'\n'}
              • Group names are automatically anonymized{'\n'}
              • You will supervise all group activities{'\n'}
              • Students are assigned anonymized display names
            </Text>
          </View>
        </View>

        {/* Theme Input */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text.primary }]}>Group Theme *</Text>
          <Text style={[styles.labelHint, { color: colors.text.secondary }]}>The topic or focus area for this group</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.background.gray, color: colors.text.primary, backgroundColor: colors.background.white }]}
            placeholder="e.g., Anxiety Management, Study Stress"
            placeholderTextColor={colors.text.light}
            value={theme}
            onChangeText={setTheme}
            maxLength={50}
          />
          
          {/* Theme Suggestions */}
          <Text style={[styles.suggestionsLabel, { color: colors.text.secondary }]}>Suggestions:</Text>
          <View style={styles.suggestionsContainer}>
            {THEME_SUGGESTIONS.map((suggestion) => (
              <TouchableOpacity
                key={suggestion}
                style={[
                  styles.suggestionChip,
                  { backgroundColor: colors.background.lightGray, borderColor: colors.background.gray },
                  theme === suggestion && { backgroundColor: colors.purple.medium, borderColor: colors.purple.darker },
                ]}
                onPress={() => handleThemeSuggestion(suggestion)}
              >
                <Text
                  style={[
                    styles.suggestionText,
                    { color: colors.text.primary },
                    theme === suggestion && { color: colors.text.white, fontWeight: '600' },
                  ]}
                >
                  {suggestion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text.primary }]}>Description (Optional)</Text>
          <Text style={[styles.labelHint, { color: colors.text.secondary }]}>Brief description of the group's purpose</Text>
          <TextInput
            style={[styles.input, styles.textArea, { borderColor: colors.background.gray, color: colors.text.primary, backgroundColor: colors.background.white }]}
            placeholder="Describe what this group will focus on..."
            placeholderTextColor={colors.text.light}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={200}
          />
        </View>

        {/* Max Members */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text.primary }]}>Maximum Members</Text>
          <Text style={[styles.labelHint, { color: colors.text.secondary }]}>Choose between 6 or 7 students</Text>
          <View style={styles.membersContainer}>
            <TouchableOpacity
              style={[
                styles.memberOption,
                { backgroundColor: colors.background.lightGray, borderColor: colors.background.gray },
                maxMembers === 6 && { backgroundColor: colors.purple.medium, borderColor: colors.purple.darker },
              ]}
              onPress={() => setMaxMembers(6)}
            >
              <Text
                style={[
                  styles.memberOptionText,
                  { color: colors.text.primary },
                  maxMembers === 6 && { color: colors.text.white },
                ]}
              >
                6 Students
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.memberOption,
                { backgroundColor: colors.background.lightGray, borderColor: colors.background.gray },
                maxMembers === 7 && { backgroundColor: colors.purple.medium, borderColor: colors.purple.darker },
              ]}
              onPress={() => setMaxMembers(7)}
            >
              <Text
                style={[
                  styles.memberOptionText,
                  { color: colors.text.primary },
                  maxMembers === 7 && { color: colors.text.white },
                ]}
              >
                7 Students
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Create Button */}
        <SubmitButton
          title="Create Group"
          onPress={handleCreate}
          disabled={!theme.trim() || loading}
          loading={loading}
          loadingText="Creating..."
          style={styles.createButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  infoBanner: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
  },
  infoIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  labelHint: {
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  suggestionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: 14,
  },
  membersContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  memberOption: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  memberOptionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  errorSubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
});

