import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

interface EmergencyContact {
  id: string;
  title: string;
  description: string;
  phone: string;
  type: 'emergency' | 'crisis' | 'support';
  isPrimary?: boolean;
}

// Emergency contacts for France
// Note: These are real, valid emergency numbers for France
const EMERGENCY_CONTACTS: EmergencyContact[] = [
  // Emergency Services
  {
    id: 'emergency_1',
    title: 'Police',
    description: 'For immediate police assistance and emergencies',
    phone: '17',
    type: 'emergency',
    isPrimary: true,
  },
  {
    id: 'emergency_2',
    title: 'Fire Department & Rescue',
    description: 'For fires, accidents, and rescue operations',
    phone: '18',
    type: 'emergency',
    isPrimary: true,
  },
  {
    id: 'emergency_3',
    title: 'Medical Emergency (SAMU)',
    description: 'For urgent medical situations requiring an ambulance',
    phone: '15',
    type: 'emergency',
    isPrimary: true,
  },
  {
    id: 'emergency_4',
    title: 'European Emergency Number',
    description: 'Universal emergency number (works throughout Europe)',
    phone: '112',
    type: 'emergency',
    isPrimary: true,
  },
  // Crisis Support
  {
    id: 'crisis_1',
    title: 'Suicide Prevention',
    description: 'Free, confidential, 24/7 support for anyone in distress',
    phone: '3114',
    type: 'crisis',
  },
  {
    id: 'crisis_2',
    title: 'Youth Health Line',
    description: 'Free support for young people (health, mental health, relationships)',
    phone: '0800 235 236',
    type: 'crisis',
  },
  {
    id: 'crisis_3',
    title: 'Violence Against Women',
    description: 'Free, anonymous support for women victims of violence',
    phone: '3919',
    type: 'crisis',
  },
  // Support Services
  {
    id: 'support_1',
    title: 'Campus Psychologists',
    description: 'Get direct access to our licensed psychologists',
    phone: '',
    type: 'support',
  },
];

export const EmergencyContactsScreen: React.FC = () => {
  const { colors } = useTheme();

  const formatPhoneNumber = (phone: string): string => {
    // Format phone numbers for display
    if (!phone) return '';
    if (phone.length <= 4) {
      return phone; // Short numbers like 17, 18, 15, 112
    }
    // Format longer numbers with spaces for readability
    return phone.replace(/(\d{2})(?=\d)/g, '$1 ');
  };

  const handleCall = (contact: EmergencyContact) => {
    if (!contact.phone) {
      Alert.alert('Contact', 'Use the Contact button to reach our psychologists');
      return;
    }

    const formattedPhone = contact.phone.replace(/\s/g, ''); // Remove spaces for dialing
    const displayPhone = formatPhoneNumber(contact.phone);

    Alert.alert(
      `Call ${contact.title}?`,
      `${contact.description}\n\nThis will dial ${displayPhone}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call',
          onPress: () => {
            const phoneNumber = `tel:${formattedPhone}`;
            Linking.openURL(phoneNumber).catch((err) => {
              console.error('Error opening phone:', err);
              Alert.alert('Error', 'Unable to make phone call. Please dial manually.');
            });
          },
        },
      ]
    );
  };

  const handleContact = (contact: EmergencyContact) => {
    // Navigate to psychologist list
    Alert.alert(
      'Contact Psychologist',
      'This will take you to the psychologist list where you can book an appointment or send a message.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background.white }]} contentContainerStyle={styles.content}>
      {/* Header */}
      <PurpleHeader title="Emergency resources" showBack />

      {/* Privacy Notice */}
      <View style={[styles.privacyBanner, { backgroundColor: colors.purple.light, borderColor: colors.purple.medium }]}>
        <Text style={styles.privacyIcon}>🔒</Text>
        <View style={styles.privacyContent}>
          <Text style={[styles.privacyTitle, { color: colors.text.primary }]}>Privacy & Confidentiality</Text>
          <Text style={[styles.privacyText, { color: colors.text.secondary }]}>
            All calls are made directly from your device. No call data is stored or tracked by this app.
          </Text>
        </View>
      </View>

      {/* Country Notice */}
      <View style={[styles.countryNotice, { backgroundColor: colors.background.lightGray }]}>
        <Text style={[styles.countryText, { color: colors.text.secondary }]}>
          📍 Emergency numbers for <Text style={[styles.countryBold, { color: colors.text.primary }]}>France</Text>
        </Text>
      </View>

      {/* Content Cards */}
      <View style={styles.cardsContainer}>
        {/* Emergency Services */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Emergency Services</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.text.secondary }]}>Call immediately in case of emergency</Text>
          {EMERGENCY_CONTACTS.filter(c => c.type === 'emergency').map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={[
                styles.contactCard,
                { backgroundColor: colors.background.card, borderColor: colors.background.gray },
                contact.isPrimary && { borderWidth: 2, borderColor: colors.status.error, backgroundColor: colors.background.white }
              ]}
              onPress={() => handleCall(contact)}
            >
              <View style={styles.contactHeader}>
                <Text style={styles.contactIcon}>🚨</Text>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactTitle, { color: colors.text.primary }]}>{contact.title}</Text>
                  <Text style={[styles.contactDescription, { color: colors.text.secondary }]}>{contact.description}</Text>
                </View>
              </View>
              <View style={[styles.phoneContainer, { backgroundColor: colors.purple.light }]}>
                <Text style={[styles.phoneNumber, { color: colors.purple.darker }]}>{formatPhoneNumber(contact.phone)}</Text>
                <Text style={[styles.callButton, { color: colors.purple.medium }]}>📞 Call</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Crisis Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Crisis Support</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.text.secondary }]}>24/7 confidential support services</Text>
          {EMERGENCY_CONTACTS.filter(c => c.type === 'crisis').map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={[styles.contactCard, { backgroundColor: colors.background.card, borderColor: colors.background.gray }]}
              onPress={() => handleCall(contact)}
            >
              <View style={styles.contactHeader}>
                <Text style={styles.contactIcon}>💙</Text>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactTitle, { color: colors.text.primary }]}>{contact.title}</Text>
                  <Text style={[styles.contactDescription, { color: colors.text.secondary }]}>{contact.description}</Text>
                </View>
              </View>
              <View style={[styles.phoneContainer, { backgroundColor: colors.purple.light }]}>
                <Text style={[styles.phoneNumber, { color: colors.purple.darker }]}>{formatPhoneNumber(contact.phone)}</Text>
                <Text style={[styles.callButton, { color: colors.purple.medium }]}>📞 Call</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Support Services */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Support Services</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.text.secondary }]}>Campus resources and professional help</Text>
          {EMERGENCY_CONTACTS.filter(c => c.type === 'support').map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={[styles.contactCard, { backgroundColor: colors.background.card, borderColor: colors.background.gray }]}
              onPress={() => handleContact(contact)}
            >
              <View style={styles.contactHeader}>
                <Text style={styles.contactIcon}>👥</Text>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactTitle, { color: colors.text.primary }]}>{contact.title}</Text>
                  <Text style={[styles.contactDescription, { color: colors.text.secondary }]}>{contact.description}</Text>
                </View>
              </View>
              <View style={[styles.contactButtonContainer, { backgroundColor: colors.purple.light }]}>
                <Text style={[styles.contactButton, { color: colors.text.primary }]}>Contact</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  privacyBanner: {
    flexDirection: 'row',
    margin: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  privacyIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  privacyContent: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  privacyText: {
    fontSize: 12,
    lineHeight: 16,
  },
  countryNotice: {
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  countryText: {
    fontSize: 14,
  },
  countryBold: {
    fontWeight: 'bold',
  },
  cardsContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  contactCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  primaryContactCard: {
    borderWidth: 2,
  },
  contactHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  contactIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  phoneContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  phoneNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  callButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactButtonContainer: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  contactButton: {
    fontSize: 16,
    fontWeight: '600',
  },
});
