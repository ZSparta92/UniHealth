import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ResourcesStackParamList } from '../../navigation/types';
import { useBooking } from '../../hooks/useBooking';
import { Booking } from '../../models/Booking';
import { colors } from '../../theme';
import { BackButton } from '../../components/common/BackButton';

type BookingConfirmationScreenRouteProp = RouteProp<ResourcesStackParamList, 'BookingConfirmation'>;
type BookingConfirmationScreenNavigationProp = NativeStackNavigationProp<ResourcesStackParamList, 'BookingConfirmation'>;

interface Props {
  route: BookingConfirmationScreenRouteProp;
  navigation: BookingConfirmationScreenNavigationProp;
}

export const BookingConfirmationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const { getBookingById } = useBooking();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      setLoading(true);
      const data = await getBookingById(bookingId);
      setBooking(data);
    } catch (error) {
      console.error('Error loading booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                    'july', 'august', 'september', 'october', 'november', 'december'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.purple.medium} />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Booking not found</Text>
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
        <Text style={styles.screenTitle}>Confirmation</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Therapist Photo Card */}
        <View style={styles.therapistCard}>
          <View style={styles.therapistCardImage}>
            <View style={styles.therapistOverlay}>
              <Text style={styles.therapistNameOverlay}>{booking.therapistName}</Text>
              <Text style={styles.therapistRoleOverlay}>Uni psychologist</Text>
            </View>
          </View>
        </View>

        {/* Success Checkmark */}
        <View style={styles.successContainer}>
          <View style={styles.checkmarkIcon}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Appointment Confirmed!</Text>
        </View>

        {/* Details Card */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>With</Text>
            <Text style={styles.detailValue}>: {booking.therapistName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>: {formatDate(booking.date)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>: {booking.time}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>: Online (Zoom)</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            // Navigate to home tab by going back to root
            navigation.getParent()?.navigate('HomeTab');
          }}
        >
          <Text style={styles.backButtonText}>Back to Dashboard</Text>
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
  therapistCard: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: -40,
  },
  therapistCardImage: {
    height: 200,
    backgroundColor: colors.purple.light,
    borderRadius: 20,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  therapistOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  therapistNameOverlay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.white,
    marginBottom: 4,
  },
  therapistRoleOverlay: {
    fontSize: 14,
    color: colors.text.white,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  checkmarkIcon: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.status.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkmarkText: {
    fontSize: 48,
    color: colors.text.white,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  detailsContainer: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    minWidth: 80,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
  },
  backButton: {
    backgroundColor: colors.purple.light,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 40,
  },
});
