import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { colors } from '../../theme';
import { BackButton } from '../../components/common/BackButton';

interface EmergencyContact {
  id: string;
  title: string;
  subtitle: string;
  phone?: string;
  type: 'emergency' | 'crisis' | 'support';
}

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: '1',
    title: 'Student Support - 24/7',
    subtitle: 'University Services',
    phone: '17',
    type: 'support',
  },
  {
    id: '2',
    title: 'Our Campus Psychologists',
    subtitle: 'Get direct access to our psychologists',
    type: 'support',
  },
  {
    id: '3',
    title: 'Emergency Services',
    subtitle: '',
    type: 'emergency',
  },
];

export const EmergencyContactsScreen: React.FC = () => {
  const handleCall = (contact: EmergencyContact) => {
    if (!contact.phone) {
      Alert.alert('Contact', 'Use the Contact button to reach our psychologists');
      return;
    }

    Alert.alert(
      `Call ${contact.title}?`,
      `This will dial ${contact.phone}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call',
          onPress: () => {
            const phoneNumber = `tel:${contact.phone}`;
            Linking.openURL(phoneNumber).catch((err) => {
              console.error('Error opening phone:', err);
              Alert.alert('Error', 'Unable to make phone call');
            });
          },
        },
      ]
    );
  };

  const handleContact = (contact: EmergencyContact) => {
    // Navigate to therapist list or contact
    Alert.alert('Contact Psychologist', 'This will take you to the psychologist list');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.brandTitle}>UniHealth</Text>
        <Text style={styles.brandSubtitle}>Because your mental well-being matters.</Text>
        <TouchableOpacity style={styles.profileIcon}>
          <Text style={styles.profileIconText}>👤</Text>
        </TouchableOpacity>
        
        <Text style={styles.screenTitle}>Emergency resources</Text>
        
        {/* Brain illustration */}
        <View style={styles.brainIllustration}>
          <Text style={styles.brainEmoji}>🧠</Text>
        </View>
      </View>

      {/* Content Cards */}
      <View style={styles.cardsContainer}>
        {/* Student Support Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Student Support - 24/7</Text>
          <Text style={styles.cardSubtitle}>University Services</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleCall(EMERGENCY_CONTACTS[0])}>
            <Text style={styles.phoneIcon}>📞</Text>
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
        </View>

        {/* Campus Psychologists Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Our Campus Psychologists</Text>
          <Text style={styles.cardSubtitle}>Get direct access to our psychologists</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleContact(EMERGENCY_CONTACTS[1])}>
            <Text style={styles.contactIcons}>👥</Text>
            <Text style={styles.actionButtonText}>Contact</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Services */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Emergency Services</Text>
          <View style={styles.emergencyButtonsContainer}>
            <TouchableOpacity style={styles.emergencyButton}>
              <Text style={styles.emergencyButtonText}>17 - Police</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emergencyButton}>
              <Text style={styles.emergencyButtonText}>18 - Fire Department</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.emergencyButton, styles.emergencyButtonWide]}>
              <Text style={styles.emergencyButtonText}>15 - Emergency Medical Services</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.white,
  },
  content: {
    paddingBottom: 100,
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
    marginBottom: 10,
  },
  brainIllustration: {
    position: 'absolute',
    right: 20,
    top: 120,
  },
  brainEmoji: {
    fontSize: 60,
  },
  cardsContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 20,
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
    color: colors.text.primary,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purple.light,
    padding: 12,
    borderRadius: 8,
  },
  phoneIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  contactIcons: {
    fontSize: 20,
    marginRight: 8,
  },
  actionButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  emergencyButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emergencyButton: {
    backgroundColor: colors.purple.light,
    padding: 12,
    borderRadius: 8,
    minWidth: '45%',
    alignItems: 'center',
  },
  emergencyButtonWide: {
    width: '100%',
  },
  emergencyButtonText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
