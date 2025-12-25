import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ResourcesStackParamList } from '../../navigation/types';
import { useTherapist } from '../../hooks/useTherapist';
import { Therapist } from '../../models/Therapist';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type TherapistListScreenNavigationProp = NativeStackNavigationProp<ResourcesStackParamList, 'TherapistList'>;

interface Props {
  navigation: TherapistListScreenNavigationProp;
}

const TherapistCard: React.FC<{
  therapist: Therapist;
  onPress: (therapistId: string) => void;
  onAppointment: (therapistId: string, therapistName: string) => void;
  onMessage: (therapistId: string, therapistName: string) => void;
}> = ({ therapist, onPress, onAppointment, onMessage }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.therapistCard, { backgroundColor: colors.background.card }]}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => onPress(therapist.id)}
      >
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: colors.background.gray, borderColor: colors.background.white }]}>
            <Text style={[styles.avatarText, { color: colors.text.secondary }]}>
              {therapist.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.therapistName, { color: colors.text.primary }]}>{therapist.name}</Text>
          <Text style={[styles.specialization, { color: colors.purple.medium }]}>{therapist.specialization}</Text>
          <Text style={[styles.role, { color: colors.text.secondary }]}>Psychologist</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.purple.light }]}
          onPress={() => onAppointment(therapist.id, therapist.name)}
        >
          <View style={styles.calendarIconContainer}>
            <Text style={styles.calendarIcon}>📅</Text>
            <Text style={[styles.calendarNumber, { color: colors.purple.darker, backgroundColor: colors.background.white }]}>15</Text>
          </View>
          <Text style={[styles.actionButtonText, { color: colors.text.primary }]}>Appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.purple.light }]}
          onPress={() => onMessage(therapist.id, therapist.name)}
        >
          <Text style={styles.messageIcon}>💬</Text>
          <Text style={[styles.actionButtonText, { color: colors.text.primary }]}>Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const TherapistListScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { therapists, loading, refreshTherapists } = useTherapist();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshTherapists();
    });
    return unsubscribe;
  }, [navigation, refreshTherapists]);

  const handleTherapistPress = (therapistId: string) => {
    navigation.navigate('TherapistDetail', { therapistId });
  };

  const handleAppointment = (therapistId: string, therapistName: string) => {
    navigation.navigate('Booking', { therapistId, therapistName });
  };

  const handleMessage = (therapistId: string, therapistName: string) => {
    navigation.navigate('Chat', { therapistId, therapistName });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.white }]}>
        <ActivityIndicator size="large" color={colors.purple.medium} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="Contact Psychologist" showBack />
      
      <View style={styles.subtitleContainer}>
        <Text style={[styles.screenSubtitle, { color: colors.text.secondary }]}>Choose a psychologist you trust</Text>
      </View>

      {/* List */}
      <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
        {therapists.map((therapist) => (
          <TherapistCard
            key={therapist.id}
            therapist={therapist}
            onPress={handleTherapistPress}
            onAppointment={handleAppointment}
            onMessage={handleMessage}
          />
        ))}
        {therapists.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>No psychologists available</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitleContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  screenSubtitle: {
    fontSize: 14,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  therapistCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  therapistName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  specialization: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  role: {
    fontSize: 13,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  calendarIconContainer: {
    position: 'relative',
  },
  calendarIcon: {
    fontSize: 20,
  },
  calendarNumber: {
    position: 'absolute',
    top: -8,
    left: 8,
    fontSize: 12,
    fontWeight: 'bold',
    width: 18,
    height: 18,
    borderRadius: 9,
    textAlign: 'center',
    lineHeight: 18,
  },
  messageIcon: {
    fontSize: 20,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  appointmentsButton: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  appointmentsButtonIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  appointmentsButtonTextContainer: {
    flex: 1,
  },
  appointmentsButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  appointmentsButtonDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
