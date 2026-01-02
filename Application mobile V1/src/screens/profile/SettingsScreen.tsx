import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { colors } from '../../theme';
import { BackButton } from '../../components/common/BackButton';
import { useTheme } from '../../context/ThemeContext';

type SettingsScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Settings'>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [dailyExercises, setDailyExercises] = useState(true);
  const [moodCheckIn, setMoodCheckIn] = useState(true);

  const handleExportData = () => {
    Alert.alert('Export Data', 'This feature will export all your data in JSON format.');
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
        <Text style={styles.screenTitle}>Preferences</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Receive daily reminders</Text>
            <Switch
              value={remindersEnabled}
              onValueChange={setRemindersEnabled}
              trackColor={{ false: colors.background.gray, true: colors.purple.medium }}
              thumbColor={colors.text.white}
            />
          </View>

          {remindersEnabled && (
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>What time</Text>
              <View style={styles.timeInput}>
                <Text style={styles.timeValue}>{reminderTime}</Text>
                <Text style={styles.clockIcon}>🕐</Text>
              </View>
            </View>
          )}

          <View style={styles.reminderTypes}>
            <Text style={styles.typesTitle}>Types of reminders</Text>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Daily exercises</Text>
              <Switch
                value={dailyExercises}
                onValueChange={setDailyExercises}
                trackColor={{ false: colors.background.gray, true: colors.purple.medium }}
                thumbColor={colors.text.white}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Mood check-in</Text>
              <Switch
                value={moodCheckIn}
                onValueChange={setMoodCheckIn}
                trackColor={{ false: colors.background.gray, true: colors.purple.medium }}
                thumbColor={colors.text.white}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Dark theme</Text>
            <Switch
              value={theme === 'dark'}
              onValueChange={() => toggleTheme()}
              trackColor={{ false: colors.background.gray, true: colors.purple.medium }}
              thumbColor={colors.text.white}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
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
  profileIcon: {
    position: 'absolute',
    top: 12,
    right: 20,
  },
  profileIconText: {
    fontSize: 18,
    color: colors.text.primary,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.white,
    marginBottom: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 40,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.gray,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text.primary,
  },
  inputRow: {
    marginTop: 16,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 12,
  },
  timeInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.background.gray,
    borderRadius: 8,
    padding: 16,
    backgroundColor: colors.background.white,
  },
  timeValue: {
    fontSize: 16,
    color: colors.text.primary,
  },
  clockIcon: {
    fontSize: 20,
  },
  reminderTypes: {
    marginTop: 24,
  },
  typesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: colors.purple.light,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
