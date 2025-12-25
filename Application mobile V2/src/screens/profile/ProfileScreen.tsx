import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type ProfileScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Profile'>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout, deleteUserData, deleteAccount } = useAuth();
  const { theme, toggleTheme, colors } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Delete My Data',
      'This will remove all your stored data (mood entries, journal entries, activities, bookings, chats) but keep your account. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUserData();
              Alert.alert('Success', 'Your data has been deleted. Your account remains active.');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete data. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete My Account',
      'This will permanently delete your account and all data. The app will be reset to its initial state. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              // App will reset automatically as all storage is cleared
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background.white }]} contentContainerStyle={styles.scrollContent}>
      {/* Header with purple background */}
      <PurpleHeader title="Profile & settings" showBack />

      {/* Profile Information */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: colors.background.gray }]}>
            <Text style={[styles.avatarText, { color: colors.text.secondary }]}>
              {user?.username ? user.username.charAt(0).toUpperCase() : 'G'}
            </Text>
          </View>
          <View style={[styles.avatarAddButton, { backgroundColor: colors.background.gray }]}>
            <Text style={styles.avatarAddText}>+</Text>
          </View>
        </View>
        <Text style={[styles.userName, { color: colors.text.primary }]}>{user?.username || 'Guest'}</Text>
      </View>

      {/* Account Section */}
      <View style={[styles.card, { backgroundColor: colors.background.card }]}>
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.cardTitle, { color: colors.text.primary }]}>Account</Text>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.purple.light }]}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={[styles.editButtonText, { color: colors.purple.medium }]}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.text.primary }]}>Email :</Text>
          <Text style={[styles.infoValue, { color: colors.text.primary }]}>{user?.email || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.text.primary }]}>Year :</Text>
          <Text style={[styles.infoValue, { color: colors.text.primary }]}>
            {user?.year || 'Not set'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.text.primary }]}>Field :</Text>
          <Text style={[styles.infoValue, { color: colors.text.primary }]}>
            {user?.field || 'Not set'}
          </Text>
        </View>
        
        {/* Privacy Notice */}
        <View style={[styles.privacyNotice, { backgroundColor: colors.purple.light }]}>
          <Text style={[styles.privacyText, { color: colors.purple.darker }]}>
            🔒 Private — stored only on your device. Not uploaded to any server.
          </Text>
        </View>
      </View>

      {/* Preferences Section */}
      <View style={[styles.card, { backgroundColor: colors.background.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text.primary }]}>Preferences</Text>
        <View style={styles.preferenceRow}>
          <Text style={[styles.preferenceLabel, { color: colors.text.primary }]}>Notification :</Text>
          <View style={[styles.checkbox, { borderColor: colors.text.dark, backgroundColor: colors.purple.medium }]}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.preferenceRow}
          onPress={() => toggleTheme()}
        >
          <Text style={[styles.preferenceLabel, { color: colors.text.primary }]}>Dark theme :</Text>
          <View style={[
            styles.checkbox,
            { borderColor: colors.text.dark },
            theme === 'dark' ? { backgroundColor: colors.purple.medium, borderColor: colors.purple.medium } : { backgroundColor: 'transparent' }
          ]}>
            {theme === 'dark' && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
      </View>

      {/* Security Section */}
      <View style={[styles.card, { backgroundColor: colors.background.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text.primary }]}>Security</Text>
        <TouchableOpacity
          style={styles.passwordRow}
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <Text style={[styles.passwordLabel, { color: colors.text.primary }]}>Change password :</Text>
          <View style={styles.passwordButton}>
            <Text style={[styles.passwordValue, { color: colors.text.primary }]}>********</Text>
            <Text style={[styles.passwordArrow, { color: colors.text.secondary }]}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Data Management Section */}
      <View style={[styles.card, { backgroundColor: colors.background.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text.primary }]}>Data Management</Text>
        
        <TouchableOpacity
          style={[styles.deleteButton, { borderColor: colors.status.warning }]}
          onPress={handleDeleteData}
        >
          <Text style={[styles.deleteButtonText, { color: colors.status.warning }]}>
            Delete My Data Only
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.deleteButton, { borderColor: colors.status.error, marginTop: 12 }]}
          onPress={handleDeleteAccount}
        >
          <Text style={[styles.deleteButtonText, { color: colors.status.error }]}>
            Delete My Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logout Section */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.status.error }]} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout / Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom nav
  },
  profileSection: {
    alignItems: 'center',
    marginTop: -40,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  avatarAddButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  avatarAddText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
  },
  privacyNotice: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  privacyText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  deleteButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  preferenceLabel: {
    fontSize: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
  },
  checkboxUnchecked: {
    backgroundColor: 'transparent',
  },
  checkmark: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  passwordLabel: {
    fontSize: 16,
  },
  passwordButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordValue: {
    fontSize: 16,
    letterSpacing: 2,
    marginRight: 8,
  },
  passwordArrow: {
    fontSize: 20,
  },
  logoutSection: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  logoutButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
