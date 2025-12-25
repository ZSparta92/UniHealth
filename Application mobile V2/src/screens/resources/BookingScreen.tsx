import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, TextInput } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ResourcesStackParamList } from '../../navigation/types';
import { useBooking } from '../../hooks/useBooking';
import { useTherapist } from '../../hooks/useTherapist';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

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
  const { colors } = useTheme();
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
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="Book an appointment" showBack />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Therapist Photo Card */}
        <View style={styles.therapistCard}>
          <View style={[styles.therapistCardImage, { backgroundColor: colors.purple.light }]}>
            <View style={styles.therapistOverlay}>
              <Text style={[styles.therapistNameOverlay, { color: colors.text.white }]}>{therapistName}</Text>
              <Text style={[styles.therapistRoleOverlay, { color: colors.text.white }]}>Psychologist</Text>
            </View>
          </View>
        </View>

        {/* Select Date */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Select a date</Text>
          <TouchableOpacity
            style={[styles.inputField, { backgroundColor: colors.background.lightGray, borderColor: colors.purple.light }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.inputText, { color: colors.text.primary }, !selectedDate && { color: colors.text.light }]}>
              {selectedDate ? formatDate(selectedDate) : 'jj/mm/aaaa'}
            </Text>
            <Text style={[styles.calendarIcon, { color: colors.text.primary }]}>📅</Text>
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
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Select a time</Text>
          <View style={styles.timeSlotsContainer}>
            {TIME_SLOTS.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  { backgroundColor: colors.background.lightGray, borderColor: colors.purple.light },
                  selectedTime === time && { backgroundColor: colors.purple.darker, borderColor: colors.purple.darker },
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    { color: colors.text.primary },
                    selectedTime === time && { color: colors.text.white, fontWeight: '600' },
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
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Appointment type</Text>
          <TouchableOpacity
            style={[styles.inputField, { backgroundColor: colors.background.lightGray, borderColor: colors.purple.light }]}
            onPress={() => setShowAppointmentTypePicker(!showAppointmentTypePicker)}
          >
            <Text style={[styles.inputText, { color: colors.text.primary }]}>{appointmentType}</Text>
            <Text style={[styles.dropdownIcon, { color: colors.text.primary }]}>⌄</Text>
          </TouchableOpacity>
          {showAppointmentTypePicker && (
            <View style={[styles.pickerContainer, { backgroundColor: colors.background.white, borderColor: colors.purple.light }]}>
              {APPOINTMENT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.pickerOption,
                    { borderBottomColor: colors.background.lightGray },
                    appointmentType === type && { backgroundColor: colors.purple.light },
                  ]}
                  onPress={() => {
                    setAppointmentType(type);
                    setShowAppointmentTypePicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      { color: colors.text.primary },
                      appointmentType === type && { color: colors.text.white, fontWeight: '600' },
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
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Location</Text>
          <TouchableOpacity
            style={[styles.inputField, { backgroundColor: colors.background.lightGray, borderColor: colors.purple.light }]}
            onPress={() => setShowLocationPicker(!showLocationPicker)}
          >
            <Text style={[styles.inputText, { color: colors.text.primary }]}>{location}</Text>
            <Text style={[styles.dropdownIcon, { color: colors.text.primary }]}>⌄</Text>
          </TouchableOpacity>
          {showLocationPicker && (
            <View style={[styles.pickerContainer, { backgroundColor: colors.background.white, borderColor: colors.purple.light }]}>
              {LOCATIONS.map((loc) => (
                <TouchableOpacity
                  key={loc}
                  style={[
                    styles.pickerOption,
                    { borderBottomColor: colors.background.lightGray },
                    location === loc && { backgroundColor: colors.purple.light },
                  ]}
                  onPress={() => {
                    setLocation(loc);
                    setShowLocationPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      { color: colors.text.primary },
                      location === loc && { color: colors.text.white, fontWeight: '600' },
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
          style={[
            styles.confirmButton,
            { backgroundColor: colors.purple.light },
            (!selectedTime || loading) && { backgroundColor: colors.background.gray, opacity: 0.6 },
          ]}
          onPress={handleBook}
          disabled={!selectedTime || loading}
        >
          <Text style={[styles.confirmButtonText, { color: colors.text.white }]}>
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
    marginBottom: 4,
  },
  therapistRoleOverlay: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  inputText: {
    fontSize: 16,
    flex: 1,
  },
  calendarIcon: {
    fontSize: 20,
  },
  dropdownIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  timeSlotText: {
    fontSize: 16,
  },
  confirmButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  pickerContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  pickerOption: {
    padding: 16,
    borderBottomWidth: 1,
  },
  pickerOptionText: {
    fontSize: 16,
  },
});
