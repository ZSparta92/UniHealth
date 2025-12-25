import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';
import { SubmitButton } from '../../components/common/SubmitButton';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { colors } = useTheme();

  // Validate form
  const isFormValid = useMemo(() => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      return false;
    }
    if (password.length < 8) {
      return false;
    }
    if (password !== confirmPassword) {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return false;
    }
    return true;
  }, [email, password, confirmPassword]);

  const handleRegister = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      // Use email prefix as username if needed, or generate one
      const username = email.split('@')[0];
      await register(username, email.trim());
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="Welcome on UniHealth" showBack />

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Sign In</Text>
        <Text style={[styles.stepIndicator, { color: colors.text.secondary }]}>Step 1 of 4</Text>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.background.gray }]}>
            <View style={[styles.progressBarFill, { width: '25%', backgroundColor: colors.purple.medium }]} />
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text.primary }]}>Email or unique ID</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.purple.light, 
                backgroundColor: colors.background.white,
                color: colors.text.primary 
              }]}
              placeholder="your.email@univ.fr"
              placeholderTextColor={colors.text.light}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text.primary }]}>Password</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.purple.light, 
                backgroundColor: colors.background.white,
                color: colors.text.primary 
              }]}
              placeholder="Minimum 8 characters"
              placeholderTextColor={colors.text.light}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text.primary }]}>Confirm Password</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.purple.light, 
                backgroundColor: colors.background.white,
                color: colors.text.primary 
              }]}
              placeholder="Confirm your password"
              placeholderTextColor={colors.text.light}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <SubmitButton
            title="Next"
            onPress={handleRegister}
            disabled={!isFormValid}
            loading={loading}
            loadingText="Creating account..."
            style={styles.submitButton}
          />
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
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stepIndicator: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBarContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});
