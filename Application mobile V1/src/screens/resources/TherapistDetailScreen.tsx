import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ResourcesStackParamList } from '../../navigation/types';
import { useTherapist } from '../../hooks/useTherapist';
import { Therapist } from '../../models/Therapist';
import { colors } from '../../theme';
import { BackButton } from '../../components/common/BackButton';

type TherapistDetailScreenRouteProp = RouteProp<ResourcesStackParamList, 'TherapistDetail'>;
type TherapistDetailScreenNavigationProp = NativeStackNavigationProp<ResourcesStackParamList, 'TherapistDetail'>;

interface Props {
  route: TherapistDetailScreenRouteProp;
  navigation: TherapistDetailScreenNavigationProp;
}

export const TherapistDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { therapistId } = route.params;
  const { getTherapistById } = useTherapist();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTherapist();
  }, [therapistId]);

  const loadTherapist = async () => {
    try {
      setLoading(true);
      const data = await getTherapistById(therapistId);
      setTherapist(data);
    } catch (error) {
      console.error('Error loading therapist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = () => {
    if (therapist) {
      navigation.navigate('Booking', {
        therapistId: therapist.id,
        therapistName: therapist.name,
      });
    }
  };

  const handleStartChat = () => {
    if (therapist) {
      navigation.navigate('Chat', {
        therapistId: therapist.id,
        therapistName: therapist.name,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.purple.medium} />
      </View>
    );
  }

  if (!therapist) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Therapist not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.brandTitle}>UniHealth</Text>
        <Text style={styles.brandSubtitle}>Because your mental well-being matters.</Text>
        <TouchableOpacity style={styles.profileIcon}>
          <Text style={styles.profileIconText}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {therapist.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
          </View>
          <Text style={styles.name}>{therapist.name}</Text>
          <Text style={styles.role}>Uni psychologist</Text>
        </View>

        {/* Details Section */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Specialty</Text>
            <Text style={styles.detailValue}>: {therapist.specialization}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Experience</Text>
            <Text style={styles.detailValue}>: {therapist.experience} years</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Approach</Text>
            <Text style={styles.detailValue}>: Cognitive Behavior Therapy (CBT)</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Availability</Text>
            <Text style={styles.detailValue}>: Monday-Friday, 9am-5pm</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, !therapist.available && styles.buttonDisabled]}
            onPress={handleBookSession}
            disabled={!therapist.available}
          >
            <Text style={styles.calendarIcon}>📅</Text>
            <Text style={styles.primaryButtonText}>Make an Appointment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleStartChat}
          >
            <Text style={styles.chatIcon}>💬</Text>
            <Text style={styles.secondaryButtonText}>Send a message</Text>
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
    marginBottom: 10,
  },
  profileIcon: {
    position: 'absolute',
    top: 12,
    right: 20,
  },
  profileIconText: {
    fontSize: 18,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: colors.background.white,
    borderRadius: 20,
    padding: 24,
    marginTop: -40,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background.gray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background.white,
  },
  avatarText: {
    color: colors.text.secondary,
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  detailsContainer: {
    marginBottom: 32,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    minWidth: 120,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
  },
  actionsContainer: {
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purple.light,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  primaryButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: colors.background.gray,
    opacity: 0.6,
  },
  calendarIcon: {
    fontSize: 20,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purple.light,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  secondaryButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  chatIcon: {
    fontSize: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 40,
  },
});
