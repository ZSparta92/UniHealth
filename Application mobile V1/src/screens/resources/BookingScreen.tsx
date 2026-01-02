import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, TextInput } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ResourcesStackParamList } from '../../navigation/types';
import { useBooking } from '../../hooks/useBooking';
import { useTherapist } from '../../hooks/useTherapist';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../theme';
import { BackButton } from '../../components/common/BackButton';

type BookingScreenRouteProp = RouteProp<ResourcesStackParamList, 'Booking'>;
type BookingScreenNavigationProp = NativeStackNavigationProp<ResourcesStackParamList, 'Booking'>;

interface Props {
  route: BookingScreenRouteProp;
  navigation: BookingScreenNavigationProp;
}

const TIME_SLOTS = ['09:00', '11:00', '13:00', '15:00', '16:00', '18:00'];
const APPOINTMENT_TYPES = ['First consultation', 'Follow-up', 'Therapy session', 'Group session', 'Emergency consultation'];
const LOCATIONS = ['On site', 'Video call', 'Phone call'];

export const BookingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { therapistId, therapistName } = route.params;
  const { createBooking } = useBooking();
  const { getTherapistById } = useTherapist();
  const [therapist, setTherapist] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>('11:00');
  const [appointmentType, setAppointmentType] = useState('First consultation');
  const [location, setLocation] = useState('On site');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAppointmentTypePicker, setShowAppointmentTypePicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    loadTherapist();
  }, [therapistId]);

  const loadTherapist = async () => {
    const data = await getTherapistById(therapistId);
    setTherapist(data);
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleBook = async () => {
    if (!selectedTime) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date');
      return;
    }

    const selectedDateTime = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDateTime.setHours(0, 0, 0, 0);

    if (selectedDateTime < today) {
      Alert.alert('Error', 'Please select a future date');
      return;
    }

    setLoading(true);
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const booking = await createBooking(therapistId, therapistName, dateString, selectedTime, appointmentType, location);
      navigation.replace('BookingConfirmation', { bookingId: booking.id });
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Book an appointment</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Therapist Photo Card */}
        <View style={styles.therapistCard}>
          <View style={styles.therapistCardImage}>
            <View style={styles.therapistOverlay}>
              <Text style={styles.therapistNameOverlay}>{therapistName}</Text>
              <Text style={styles.therapistRoleOverlay}>Uni psychologist</Text>
            </View>
          </View>
        </View>

        {/* Select Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select a date</Text>
          <TouchableOpacity
            style={styles.inputField}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.inputText, !selectedDate && styles.placeholderText]}>
              {selectedDate ? formatDate(selectedDate) : 'jj/mm/aaaa'}
            </Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* Select Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select a time</Text>
          <View style={styles.timeSlotsContainer}>
            {TIME_SLOTS.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.timeSlotSelected,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.timeSlotTextSelected,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Appointment Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment type</Text>
          <TouchableOpacity
            style={styles.inputField}
            onPress={() => setShowAppointmentTypePicker(!showAppointmentTypePicker)}
          >
            <Text style={styles.inputText}>{appointmentType}</Text>
            <Text style={styles.dropdownIcon}>⌄</Text>
          </TouchableOpacity>
          {showAppointmentTypePicker && (
            <View style={styles.pickerContainer}>
              {APPOINTMENT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.pickerOption,
                    appointmentType === type && styles.pickerOptionSelected,
                  ]}
                  onPress={() => {
                    setAppointmentType(type);
                    setShowAppointmentTypePicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      appointmentType === type && styles.pickerOptionTextSelected,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <TouchableOpacity
            style={styles.inputField}
            onPress={() => setShowLocationPicker(!showLocationPicker)}
          >
            <Text style={styles.inputText}>{location}</Text>
            <Text style={styles.dropdownIcon}>⌄</Text>
          </TouchableOpacity>
          {showLocationPicker && (
            <View style={styles.pickerContainer}>
              {LOCATIONS.map((loc) => (
                <TouchableOpacity
                  key={loc}
                  style={[
                    styles.pickerOption,
                    location === loc && styles.pickerOptionSelected,
                  ]}
                  onPress={() => {
                    setLocation(loc);
                    setShowLocationPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      location === loc && styles.pickerOptionTextSelected,
                    ]}
                  >
                    {loc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={[styles.confirmButton, (!selectedTime || loading) && styles.confirmButtonDisabled]}
          onPress={handleBook}
          disabled={!selectedTime || loading}
        >
          <Text style={styles.confirmButtonText}>
            {loading ? 'Booking...' : 'Confirm appointment'}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.white,
    textAlign: 'center',
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
    borderRadius: 16,
    overflow: 'hidden',
  },
  therapistCardImage: {
    height: 200,
    backgroundColor: colors.purple.light,
    borderRadius: 16,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  therapistOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  inputField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.lightGray,
    borderWidth: 1,
    borderColor: colors.purple.light,
    borderRadius: 8,
    padding: 16,
  },
  inputText: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
  },
  placeholderText: {
    color: colors.text.light,
  },
  calendarIcon: {
    fontSize: 20,
    color: colors.text.primary,
  },
  dropdownIcon: {
    fontSize: 20,
    color: colors.text.primary,
    marginLeft: 8,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    backgroundColor: colors.background.lightGray,
    borderWidth: 1,
    borderColor: colors.purple.light,
    borderRadius: 8,
    padding: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  timeSlotSelected: {
    backgroundColor: colors.purple.darker,
    borderColor: colors.purple.darker,
  },
  timeSlotText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  timeSlotTextSelected: {
    color: colors.text.white,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: colors.purple.light,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonDisabled: {
    backgroundColor: colors.background.gray,
    opacity: 0.6,
  },
  confirmButtonText: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: '600',
  },
  pickerContainer: {
    marginTop: 8,
    backgroundColor: colors.background.white,
    borderWidth: 1,
    borderColor: colors.purple.light,
    borderRadius: 8,
    overflow: 'hidden',
  },
  pickerOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.lightGray,
  },
  pickerOptionSelected: {
    backgroundColor: colors.purple.light,
  },
  pickerOptionText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  pickerOptionTextSelected: {
    color: colors.text.white,
    fontWeight: '600',
  },
});
