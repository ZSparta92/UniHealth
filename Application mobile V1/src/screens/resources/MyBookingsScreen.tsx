import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ResourcesStackParamList } from '../../navigation/types';
import { useBooking } from '../../hooks/useBooking';
import { Booking } from '../../models/Booking';
import { colors } from '../../theme';
import { BackButton } from '../../components/common/BackButton';

type MyBookingsScreenNavigationProp = NativeStackNavigationProp<ResourcesStackParamList, 'MyBookings'>;

interface Props {
  navigation: MyBookingsScreenNavigationProp;
}

const BookingCard: React.FC<{
  booking: Booking;
  onPress: (bookingId: string) => void;
}> = ({ booking, onPress }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return colors.status.success;
      case 'pending':
        return colors.status.warning;
      case 'cancelled':
        return colors.status.error;
      case 'completed':
        return colors.text.secondary;
      default:
        return colors.text.secondary;
    }
  };

  return (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => onPress(booking.id)}
    >
      <View style={styles.bookingHeader}>
        <Text style={styles.therapistName}>{booking.therapistName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
          <Text style={styles.statusText}>{booking.status}</Text>
        </View>
      </View>
      
      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{formatDate(booking.date)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time:</Text>
          <Text style={styles.detailValue}>{booking.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Type:</Text>
          <Text style={styles.detailValue}>{booking.appointmentType}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>{booking.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const MyBookingsScreen: React.FC<Props> = ({ navigation }) => {
  const { bookings, loading, refreshBookings } = useBooking();
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshBookings();
    });
    return unsubscribe;
  }, [navigation, refreshBookings]);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const { upcomingBookings, pastBookings } = useMemo(() => {
    const upcoming: Booking[] = [];
    const past: Booking[] = [];

    bookings.forEach((booking) => {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(0, 0, 0, 0);
      
      if (bookingDate >= now && booking.status !== 'cancelled' && booking.status !== 'completed') {
        upcoming.push(booking);
      } else {
        past.push(booking);
      }
    });

    // Sort upcoming by date (ascending)
    upcoming.sort((a, b) => {
      const dateA = new Date(a.date + 'T' + a.time);
      const dateB = new Date(b.date + 'T' + b.time);
      return dateA.getTime() - dateB.getTime();
    });

    // Sort past by date (descending)
    past.sort((a, b) => {
      const dateA = new Date(a.date + 'T' + a.time);
      const dateB = new Date(b.date + 'T' + b.time);
      return dateB.getTime() - dateA.getTime();
    });

    return { upcoming, past };
  }, [bookings, now]);

  const handleBookingPress = (bookingId: string) => {
    // Navigate to booking detail if needed, or just show booking confirmation
    // For now, we can navigate to BookingConfirmation
    navigation.navigate('BookingConfirmation', { bookingId });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.brandTitle}>UniHealth</Text>
          <Text style={styles.brandSubtitle}>Because your mental well-being matters.</Text>
          <Text style={styles.screenTitle}>My Appointments</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.purple.medium} />
        </View>
      </View>
    );
  }

  const displayedBookings = selectedTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.brandTitle}>UniHealth</Text>
        <Text style={styles.brandSubtitle}>Because your mental well-being matters.</Text>
        <Text style={styles.screenTitle}>My Appointments</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'upcoming' && styles.tabActive]}
          onPress={() => setSelectedTab('upcoming')}
        >
          <Text style={[styles.tabText, selectedTab === 'upcoming' && styles.tabTextActive]}>
            Upcoming ({upcomingBookings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'past' && styles.tabActive]}
          onPress={() => setSelectedTab('past')}
        >
          <Text style={[styles.tabText, selectedTab === 'past' && styles.tabTextActive]}>
            Past ({pastBookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {displayedBookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {selectedTab === 'upcoming'
                ? 'No upcoming appointments'
                : 'No past appointments'}
            </Text>
            <Text style={styles.emptySubtext}>
              {selectedTab === 'upcoming'
                ? 'Book an appointment with a therapist to see it here'
                : 'Your completed appointments will appear here'}
            </Text>
          </View>
        ) : (
          displayedBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onPress={handleBookingPress}
            />
          ))
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
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.lightGray,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.purple.medium,
  },
  tabText: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.purple.medium,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  bookingCard: {
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
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  therapistName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.white,
    textTransform: 'capitalize',
  },
  bookingDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '600',
  },
});
