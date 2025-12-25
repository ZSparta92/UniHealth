import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ResourcesStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type ResourcesScreenNavigationProp = NativeStackNavigationProp<ResourcesStackParamList, 'Resources'>;

interface Props {
  navigation: ResourcesScreenNavigationProp;
}

export const ResourcesScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="Resources" showBack />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Support & Help</Text>
          <Text style={[styles.sectionDescription, { color: colors.text.secondary }]}>
            Get professional support and access emergency resources
          </Text>
          
          <TouchableOpacity
            style={[styles.resourceCard, { backgroundColor: colors.background.card }]}
            onPress={() => navigation.navigate('TherapistList')}
          >
            <Text style={styles.cardIcon}>👨‍⚕️</Text>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.text.primary }]}>Find a Psychologist</Text>
              <Text style={[styles.cardDescription, { color: colors.text.secondary }]}>
                Connect with licensed psychologists
              </Text>
            </View>
            <Text style={[styles.cardArrow, { color: colors.text.secondary }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resourceCard, { backgroundColor: colors.background.card }]}
            onPress={() => navigation.navigate('EmergencyContacts')}
          >
            <Text style={styles.cardIcon}>🚨</Text>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.text.primary }]}>Emergency Contacts</Text>
              <Text style={[styles.cardDescription, { color: colors.text.secondary }]}>
                Important numbers for crisis support
              </Text>
            </View>
            <Text style={[styles.cardArrow, { color: colors.text.secondary }]}>›</Text>
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  resourceCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardArrow: {
    fontSize: 24,
    marginLeft: 8,
  },
});
