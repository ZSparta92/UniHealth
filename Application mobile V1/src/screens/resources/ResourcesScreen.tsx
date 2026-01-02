import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ResourcesStackParamList } from '../../navigation/types';
import { colors } from '../../theme';
import { BackButton } from '../../components/common/BackButton';

type ResourcesScreenNavigationProp = NativeStackNavigationProp<ResourcesStackParamList, 'Resources'>;

interface Props {
  navigation: ResourcesScreenNavigationProp;
}

export const ResourcesScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.brandTitle}>UniHealth</Text>
        <Text style={styles.brandSubtitle}>Because your mental well-being matters.</Text>
        <TouchableOpacity
          style={styles.messageIcon}
          onPress={() => {
            // Navigate to Community Chat - go up to MainNavigator
            const mainNav = navigation.getParent()?.getParent();
            if (mainNav) {
              (mainNav as any).navigate('CommunityChat');
            }
          }}
        >
          <Text style={styles.messageIconText}>💬</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Resources</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.resourceCard}
          onPress={() => navigation.navigate('TherapistList')}
        >
          <Text style={styles.cardTitle}>Therapists</Text>
          <Text style={styles.cardDescription}>
            Connect with licensed mental health professionals
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resourceCard}
          onPress={() => navigation.navigate('EmergencyContacts')}
        >
          <Text style={styles.cardTitle}>Emergency Contacts</Text>
          <Text style={styles.cardDescription}>
            Important numbers for crisis support
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resourceCard}
          onPress={() => navigation.navigate('BreathingExercise')}
        >
          <Text style={styles.cardTitle}>Breathing Exercises</Text>
          <Text style={styles.cardDescription}>
            Guided exercises for stress relief
          </Text>
        </TouchableOpacity>
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
  messageIcon: {
    position: 'absolute',
    top: 12,
    right: 20,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageIconText: {
    fontSize: 20,
    color: colors.text.white,
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
  resourceCard: {
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
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text.primary,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});
