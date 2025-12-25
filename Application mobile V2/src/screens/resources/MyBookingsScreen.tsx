import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ResourcesStackParamList } from '../../navigation/types';
import { useBooking } from '../../hooks/useBooking';
import { Booking } from '../../models/Booking';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type MyBookingsScreenNavigationProp = NativeStackNavigationProp<ResourcesStackParamList, 'MyBookings'>;

interface Props {
  navigation: MyBookingsScreenNavigationProp;
}

const BookingCard: React.FC<{
  booking: Booking;
  onPress: (bookingId: string) => void;
}> = ({ booking, onPress }) => {
  const { colors } = useTheme();
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
      style={[styles.bookingCard, { backgroundColor: colors.background.card }]}
      onPress={() => onPress(booking.id)}
    >
      <View style={styles.bookingHeader}>
        <Text style={[styles.therapistName, { color: colors.text.primary }]}>{booking.therapistName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
          <Text style={[styles.statusText, { color: colors.text.white }]}>{booking.status}</Text>
        </View>
      </View>
      
      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Date:</Text>
          <Text style={[styles.detailValue, { color: colors.text.primary }]}>{formatDate(booking.date)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Time:</Text>
          <Text style={[styles.detailValue, { color: colors.text.primary }]}>{booking.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Type:</Text>
          <Text style={[styles.detailValue, { color: colors.text.primary }]}>{booking.appointmentType}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Location:</Text>
          <Text style={[styles.detailValue, { color: colors.text.primary }]}>{booking.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const MyBookingsScreen: React.FC<Props> = ({ navigation }) => {
  const { bookings, loading, refreshBookings } = useBooking();
  const { colors } = useTheme();
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
      <View style={[styles.container, { backgroundColor: colors.background.white }]}>
        <PurpleHeader title="My Appointments" showBack />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.purple.medium} />
        </View>
      </View>
    );
  }

  const displayedBookings = selectedTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="My Appointments" showBack />

      {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: colors.background.white, borderBottomColor: colors.background.lightGray }]}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'upcoming' && { borderBottomColor: colors.purple.medium }]}
          onPress={() => setSelectedTab('upcoming')}
        >
          <Text style={[styles.tabText, { color: colors.text.secondary }, selectedTab === 'upcoming' && { color: colors.purple.medium, fontWeight: '600' }]}>
            Upcoming ({upcomingBookings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'past' && { borderBottomColor: colors.purple.medium }]}
          onPress={() => setSelectedTab('past')}
        >
          <Text style={[styles.tabText, { color: colors.text.secondary }, selectedTab === 'past' && { color: colors.purple.medium, fontWeight: '600' }]}>
            Past ({pastBookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {displayedBookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text.primary }]}>
              {selectedTab === 'upcoming'
                ? 'No upcoming appointments'
                : 'No past appointments'}
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.text.secondary }]}>
              {selectedTab === 'upcoming'
                ? 'Book an appointment with a psychologist to see it here'
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
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
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
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  bookingCard: {
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
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
