import { useState, useEffect } from 'react';
import { Booking } from '../models/Booking';
import { BookingStorage } from '../storage/bookingStorage';
import { useAuth } from './useAuth';

export const useBooking = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await BookingStorage.getAllBookings(user.id);
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (
    therapistId: string,
    therapistName: string,
    date: string,
    time: string,
    appointmentType: string,
    location: string
  ): Promise<Booking> => {
    if (!user) throw new Error('User not authenticated');

    const booking = await BookingStorage.createBooking(
      user.id,
      therapistId,
      therapistName,
      date,
      time,
      appointmentType,
      location
    );
    await loadBookings();
    return booking;
  };

  const getBookingById = async (bookingId: string): Promise<Booking | null> => {
    if (!user) return null;
    return await BookingStorage.getBookingById(user.id, bookingId);
  };

  const updateBookingStatus = async (
    bookingId: string,
    status: Booking['status']
  ): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    await BookingStorage.updateBookingStatus(user.id, bookingId, status);
    await loadBookings();
  };

  return {
    bookings,
    loading,
    createBooking,
    getBookingById,
    updateBookingStatus,
    refreshBookings: loadBookings,
  };
};
