import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Storage } from '../../storage/asyncStorage';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type PrivacyScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Privacy'>;

interface Props {
  navigation: PrivacyScreenNavigationProp;
}

export const PrivacyScreen: React.FC<Props> = ({ navigation }) => {
  const { logout } = useAuth();
  const { colors } = useTheme();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteData = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all your data including mood entries, journal entries, bookings, and chat messages. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are you sure?',
              'This will delete ALL your data and reset the app. You will need to go through onboarding again.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Yes, Delete Everything',
                  style: 'destructive',
                  onPress: confirmDeleteData,
                },
              ]
            );
          },
        },
      ]
    );
  };

  const confirmDeleteData = async () => {
    try {
      setDeleting(true);
      await Storage.clear();
      await logout();
      Alert.alert(
        'Data Deleted',
        'All your data has been deleted. The app will restart.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error deleting data:', error);
      Alert.alert('Error', 'Failed to delete data. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="Privacy & Data" showBack />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Data Management</Text>
          
          <View style={[styles.infoBox, { backgroundColor: colors.background.card }]}>
            <Text style={[styles.infoTitle, { color: colors.text.primary }]}>Your Data is Private</Text>
            <Text style={[styles.infoText, { color: colors.text.secondary }]}>
              All your data is stored locally on your device. We don't collect or transmit any personal information.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>What's Stored Locally</Text>
          
          <View style={[styles.dataItem, { borderBottomColor: colors.background.gray }]}>
            <Text style={[styles.dataLabel, { color: colors.text.primary }]}>Mood Entries</Text>
            <Text style={[styles.dataDescription, { color: colors.text.secondary }]}>Your daily mood tracking</Text>
          </View>

          <View style={[styles.dataItem, { borderBottomColor: colors.background.gray }]}>
            <Text style={[styles.dataLabel, { color: colors.text.primary }]}>Journal Entries</Text>
            <Text style={[styles.dataDescription, { color: colors.text.secondary }]}>Your personal journal</Text>
          </View>

          <View style={[styles.dataItem, { borderBottomColor: colors.background.gray }]}>
            <Text style={[styles.dataLabel, { color: colors.text.primary }]}>Bookings</Text>
            <Text style={[styles.dataDescription, { color: colors.text.secondary }]}>Therapist session bookings</Text>
          </View>

          <View style={[styles.dataItem, { borderBottomColor: colors.background.gray }]}>
            <Text style={[styles.dataLabel, { color: colors.text.primary }]}>Chat Messages</Text>
            <Text style={[styles.dataDescription, { color: colors.text.secondary }]}>Messages with therapists</Text>
          </View>

          <View style={[styles.dataItem, { borderBottomColor: colors.background.gray }]}>
            <Text style={[styles.dataLabel, { color: colors.text.primary }]}>User Profile</Text>
            <Text style={[styles.dataDescription, { color: colors.text.secondary }]}>Your account information</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Delete All Data</Text>
          
          <Text style={[styles.warningText, { color: colors.status.error }]}>
            Permanently delete all your data and reset the app. This action cannot be undone.
          </Text>

          <TouchableOpacity
            style={[
              styles.deleteButton,
              { backgroundColor: colors.status.error },
              deleting && { backgroundColor: colors.background.gray },
            ]}
            onPress={handleDeleteData}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator color={colors.text.white} />
            ) : (
              <Text style={[styles.deleteButtonText, { color: colors.text.white }]}>Delete All My Data</Text>
            )}
          </TouchableOpacity>
        </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  dataItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  dataLabel: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '600',
  },
  dataDescription: {
    fontSize: 14,
  },
  warningText: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  deleteButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
