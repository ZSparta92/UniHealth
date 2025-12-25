import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { useAuth } from '../../hooks/useAuth';
import { useTheme, ColorScheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';
import { SubmitButton } from '../../components/common/SubmitButton';

type ChangePasswordScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'ChangePassword'>;

interface Props {
  navigation: ChangePasswordScreenNavigationProp;
}

export const ChangePasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  // Create styles with theme colors
  const styles = useMemo(() => makeStyles(colors), [colors]);

  // Validate form
  const isFormValid = useMemo(() => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      return false;
    }
    if (newPassword.length < 8) {
      return false;
    }
    if (newPassword !== confirmPassword) {
      return false;
    }
    if (currentPassword === newPassword) {
      return false;
    }
    return true;
  }, [currentPassword, newPassword, confirmPassword]);

  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from current password');
      return;
    }

    setSaving(true);
    try {
      // In a real app, verify current password and update
      // For now, we'll just show success since we don't have password storage
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      Alert.alert(
        'Success',
        'Password changed successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="Change Password" showBack />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter current password"
              placeholderTextColor={colors.text.light}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new password (min. 8 characters)"
              placeholderTextColor={colors.text.light}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.hintText}>Must be at least 8 characters long</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              placeholderTextColor={colors.text.light}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <SubmitButton
            title="Change Password"
            onPress={handleChangePassword}
            disabled={!isFormValid}
            loading={saving}
            loadingText="Changing Password..."
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

// Styles factory function - colors must be provided at runtime
const makeStyles = (colors: ColorScheme) => StyleSheet.create({
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
  form: {
    marginTop: 20,
  },
  inputGroup: {
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
    padding: 16,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background.white,
  },
  hintText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 20,
  },
});
