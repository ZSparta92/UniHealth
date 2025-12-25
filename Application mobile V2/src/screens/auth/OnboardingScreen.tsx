import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

interface Props {
  navigation: OnboardingScreenNavigationProp;
}

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  const handleNext = () => {
    setShowWelcomeModal(false);
    navigation.replace('Welcome');
  };

  const handleGetStarted = () => {
    navigation.replace('Welcome');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="Welcome on UniHealth" showBack={false} />

      {/* Main Content Area */}
      <View style={styles.content}>
        {/* Get Started Button (behind modal) */}
        <TouchableOpacity style={[styles.getStartedButton, { backgroundColor: colors.purple.dark }]} onPress={handleGetStarted}>
          <Text style={[styles.getStartedButtonText, { color: colors.text.white }]}>Get started</Text>
        </TouchableOpacity>

        {/* Forgot Password Text (behind modal) */}
        <TouchableOpacity>
          <Text style={[styles.forgotPassword, { color: colors.text.secondary }]}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      {/* Welcome Modal */}
      <Modal
        visible={showWelcomeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleNext}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.background.white }]}>
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>Welcome to the login page</Text>
            
            <Text style={[styles.modalText, { color: colors.text.primary }]}>
              For registration, use your university email address; We will send you a unique identifier that will allow you to be linked to your university.
            </Text>

            <Text style={[styles.modalText, { color: colors.text.primary }]}>
              For everything else, your data is stored only on your device.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalNextButton, { backgroundColor: colors.purple.light }]} onPress={handleNext}>
                <Text style={[styles.modalNextButtonText, { color: colors.text.white }]}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  getStartedButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
    marginBottom: 20,
  },
  getStartedButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'left',
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'left',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  modalNextButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalNextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
