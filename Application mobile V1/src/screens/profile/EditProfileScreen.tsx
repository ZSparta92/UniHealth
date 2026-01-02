import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { useAuth } from '../../hooks/useAuth';
import { UserStorage } from '../../storage/userStorage';
import { colors } from '../../theme';
import { BackButton } from '../../components/common/BackButton';

type EditProfileScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'EditProfile'>;

interface Props {
  navigation: EditProfileScreenNavigationProp;
}

export const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, refreshAuthState } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [year, setYear] = useState('L2'); // Default value, could be stored in user model
  const [field, setField] = useState('Computer Sciences'); // Default value
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      // In a real app, year and field would be part of the User model
      // For now, we use default values
    }
  }, [user]);

  const handleSave = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setSaving(true);
    try {
      await UserStorage.updateUser({
        email: email.trim(),
        // Note: year and field would need to be added to User model to persist
      });
      await refreshAuthState();
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.brandTitle}>UniHealth</Text>
        <Text style={styles.brandSubtitle}>Because your mental well-being matters.</Text>
        <Text style={styles.screenTitle}>Edit Profile</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@univ.fr"
              placeholderTextColor={colors.text.light}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Year</Text>
            <TextInput
              style={styles.input}
              placeholder="L1, L2, L3, M1, M2"
              placeholderTextColor={colors.text.light}
              value={year}
              onChangeText={setYear}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Field</Text>
            <TextInput
              style={styles.input}
              placeholder="Your field of study"
              placeholderTextColor={colors.text.light}
              value={field}
              onChangeText={setField}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Text>
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
  saveButton: {
    backgroundColor: colors.purple.medium,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
