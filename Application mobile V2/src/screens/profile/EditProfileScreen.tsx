import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { useAuth } from '../../hooks/useAuth';
import { UserStorage } from '../../storage/userStorage';
import { useTheme, ColorScheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';
import { SubmitButton } from '../../components/common/SubmitButton';

type EditProfileScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'EditProfile'>;

interface Props {
  navigation: EditProfileScreenNavigationProp;
}

export const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, refreshAuthState } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState(user?.email || '');
  const [year, setYear] = useState(''); // Empty by default - user can optionally fill
  const [field, setField] = useState(''); // Empty by default - user can optionally fill
  const [saving, setSaving] = useState(false);

  // Create styles with theme colors
  const styles = useMemo(() => makeStyles(colors), [colors]);

  // Validate form
  const isFormValid = useMemo(() => {
    if (!email.trim()) {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }, [email]);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setYear(user.year || '');
      setField(user.field || '');
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
        year: year.trim() || undefined,
        field: field.trim() || undefined,
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
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="Edit Profile" showBack />

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

          <SubmitButton
            title="Save Changes"
            onPress={handleSave}
            disabled={!isFormValid}
            loading={saving}
            loadingText="Saving..."
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
  submitButton: {
    marginTop: 20,
  },
});
