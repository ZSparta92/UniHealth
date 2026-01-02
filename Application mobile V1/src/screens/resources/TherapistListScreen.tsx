import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ResourcesStackParamList } from '../../navigation/types';
import { useTherapist } from '../../hooks/useTherapist';
import { Therapist } from '../../models/Therapist';
import { colors } from '../../theme';
import { BackButton } from '../../components/common/BackButton';

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
  return (
    <View style={styles.therapistCard}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => onPress(therapist.id)}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {therapist.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.therapistName}>{therapist.name}</Text>
          <Text style={styles.role}>Uni psychologist</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onAppointment(therapist.id, therapist.name)}
        >
          <View style={styles.calendarIconContainer}>
            <Text style={styles.calendarIcon}>📅</Text>
            <Text style={styles.calendarNumber}>15</Text>
          </View>
          <Text style={styles.actionButtonText}>Appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onMessage(therapist.id, therapist.name)}
        >
          <Text style={styles.messageIcon}>💬</Text>
          <Text style={styles.actionButtonText}>Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const TherapistListScreen: React.FC<Props> = ({ navigation }) => {
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
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.purple.medium} />
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
        <TouchableOpacity
          style={styles.messageIcon}
          onPress={() => {
            // Navigate to Community Chat - go up to MainNavigator
            // TherapistListScreen -> ResourcesStack -> TabNavigator -> MainNavigator
            const mainNav = navigation.getParent()?.getParent()?.getParent();
            if (mainNav) {
              (mainNav as any).navigate('CommunityChat');
            }
          }}
        >
          <Text style={styles.messageIconText}>💬</Text>
        </TouchableOpacity>
        
        <Text style={styles.screenTitle}>Contact Psychologist.</Text>
        <Text style={styles.screenSubtitle}>Choose a psychologist you trust</Text>
        
        {/* Brain illustration */}
        <View style={styles.brainIllustration}>
          <Text style={styles.brainEmoji}>🧠</Text>
        </View>
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
            <Text style={styles.emptyText}>No therapists available</Text>
          </View>
        )}
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
    marginBottom: 2,
  },
  screenSubtitle: {
    fontSize: 14,
    color: colors.text.white,
    marginBottom: 4,
  },
  brainIllustration: {
    position: 'absolute',
    right: 20,
    top: 60,
  },
  brainEmoji: {
    fontSize: 40,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  therapistCard: {
    backgroundColor: colors.background.card,
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
    backgroundColor: colors.background.gray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background.white,
  },
  avatarText: {
    color: colors.text.secondary,
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
    color: colors.text.primary,
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: colors.text.secondary,
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
    backgroundColor: colors.purple.light,
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
    color: colors.purple.darker,
    backgroundColor: colors.background.white,
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
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  appointmentsButton: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
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
    color: colors.text.primary,
    marginBottom: 4,
  },
  appointmentsButtonDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});
