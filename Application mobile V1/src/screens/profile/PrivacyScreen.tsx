import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Storage } from '../../storage/asyncStorage';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../theme';
import { BackButton } from '../../components/common/BackButton';

type PrivacyScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Privacy'>;

interface Props {
  navigation: PrivacyScreenNavigationProp;
}

export const PrivacyScreen: React.FC<Props> = ({ navigation }) => {
  const { logout } = useAuth();
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.brandTitle}>UniHealth</Text>
        <Text style={styles.brandSubtitle}>Because your mental well-being matters.</Text>
        <TouchableOpacity style={styles.profileIcon}>
          <Text style={styles.profileIconText}>👤</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Privacy & Data</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Your Data is Private</Text>
            <Text style={styles.infoText}>
              All your data is stored locally on your device. We don't collect or transmit any personal information.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's Stored Locally</Text>
          
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>Mood Entries</Text>
            <Text style={styles.dataDescription}>Your daily mood tracking</Text>
          </View>

          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>Journal Entries</Text>
            <Text style={styles.dataDescription}>Your personal journal</Text>
          </View>

          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>Bookings</Text>
            <Text style={styles.dataDescription}>Therapist session bookings</Text>
          </View>

          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>Chat Messages</Text>
            <Text style={styles.dataDescription}>Messages with therapists</Text>
          </View>

          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>User Profile</Text>
            <Text style={styles.dataDescription}>Your account information</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delete All Data</Text>
          
          <Text style={styles.warningText}>
            Permanently delete all your data and reset the app. This action cannot be undone.
          </Text>

          <TouchableOpacity
            style={[styles.deleteButton, deleting && styles.deleteButtonDisabled]}
            onPress={handleDeleteData}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator color={colors.text.white} />
            ) : (
              <Text style={styles.deleteButtonText}>Delete All My Data</Text>
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
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text.primary,
  },
  infoBox: {
    backgroundColor: colors.background.card,
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text.primary,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  dataItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.gray,
  },
  dataLabel: {
    fontSize: 16,
    marginBottom: 4,
    color: colors.text.primary,
    fontWeight: '600',
  },
  dataDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  warningText: {
    fontSize: 14,
    color: colors.status.error,
    marginBottom: 16,
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: colors.status.error,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButtonDisabled: {
    backgroundColor: colors.background.gray,
  },
  deleteButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
