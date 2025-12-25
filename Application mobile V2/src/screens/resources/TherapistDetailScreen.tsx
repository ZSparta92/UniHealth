import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ResourcesStackParamList } from '../../navigation/types';
import { useTherapist } from '../../hooks/useTherapist';
import { Therapist } from '../../models/Therapist';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type TherapistDetailScreenRouteProp = RouteProp<ResourcesStackParamList, 'TherapistDetail'>;
type TherapistDetailScreenNavigationProp = NativeStackNavigationProp<ResourcesStackParamList, 'TherapistDetail'>;

interface Props {
  route: TherapistDetailScreenRouteProp;
  navigation: TherapistDetailScreenNavigationProp;
}

export const TherapistDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { therapistId } = route.params;
  const { getTherapistById } = useTherapist();
  const { colors } = useTheme();
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
      <View style={[styles.container, { backgroundColor: colors.background.white }]}>
        <PurpleHeader title="Psychologist Details" showBack />
        <ActivityIndicator size="large" color={colors.purple.medium} style={styles.loader} />
      </View>
    );
  }

  if (!therapist) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.white }]}>
        <PurpleHeader title="Psychologist Details" showBack />
        <Text style={[styles.errorText, { color: colors.text.secondary }]}>Psychologist not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="Psychologist Details" showBack />

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
          <Text style={styles.role}>Psychologist</Text>
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
  },
  loader: {
    marginTop: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  profileCard: {
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
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
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
    minWidth: 120,
  },
  detailValue: {
    fontSize: 16,
    flex: 1,
  },
  actionsContainer: {
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  calendarIcon: {
    fontSize: 20,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  chatIcon: {
    fontSize: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
