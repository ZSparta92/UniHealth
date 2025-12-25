import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type SettingsScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Settings'>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, toggleTheme, colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [dailyExercises, setDailyExercises] = useState(true);
  const [moodCheckIn, setMoodCheckIn] = useState(true);

  const handleExportData = () => {
    Alert.alert('Export Data', 'This feature will export all your data in JSON format.');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="Preferences" showBack />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <View style={[styles.settingRow, { borderBottomColor: colors.background.gray }]}>
            <Text style={[styles.settingLabel, { color: colors.text.primary }]}>Receive daily reminders</Text>
            <Switch
              value={remindersEnabled}
              onValueChange={setRemindersEnabled}
              trackColor={{ false: colors.background.gray, true: colors.purple.medium }}
              thumbColor={colors.text.white}
            />
          </View>

          {remindersEnabled && (
            <View style={styles.inputRow}>
              <Text style={[styles.inputLabel, { color: colors.text.primary }]}>What time</Text>
              <View style={[styles.timeInput, { borderColor: colors.background.gray, backgroundColor: colors.background.white }]}>
                <Text style={[styles.timeValue, { color: colors.text.primary }]}>{reminderTime}</Text>
                <Text style={styles.clockIcon}>🕐</Text>
              </View>
            </View>
          )}

          <View style={styles.reminderTypes}>
            <Text style={[styles.typesTitle, { color: colors.text.primary }]}>Types of reminders</Text>
            
            <View style={[styles.settingRow, { borderBottomColor: colors.background.gray }]}>
              <Text style={[styles.settingLabel, { color: colors.text.primary }]}>Daily exercises</Text>
              <Switch
                value={dailyExercises}
                onValueChange={setDailyExercises}
                trackColor={{ false: colors.background.gray, true: colors.purple.medium }}
                thumbColor={colors.text.white}
              />
            </View>

            <View style={[styles.settingRow, { borderBottomColor: colors.background.gray }]}>
              <Text style={[styles.settingLabel, { color: colors.text.primary }]}>Mood check-in</Text>
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
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Appearance</Text>
          <View style={[styles.settingRow, { borderBottomColor: colors.background.gray }]}>
            <Text style={[styles.settingLabel, { color: colors.text.primary }]}>Dark theme</Text>
            <Switch
              value={theme === 'dark'}
              onValueChange={() => toggleTheme()}
              trackColor={{ false: colors.background.gray, true: colors.purple.medium }}
              thumbColor={colors.text.white}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.purple.light }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.nextButtonText, { color: colors.text.white }]}>Next</Text>
        </TouchableOpacity>
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
  section: {
    marginBottom: 40,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: 16,
  },
  inputRow: {
    marginTop: 16,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 12,
  },
  timeInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  timeValue: {
    fontSize: 16,
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  nextButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
