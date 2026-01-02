import { Storage } from './asyncStorage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { Booking } from '../models/Booking';

export const BookingStorage = {
  async getAllBookings(userId: string): Promise<Booking[]> {
    try {
      const data = await Storage.getItem(`${STORAGE_KEYS.BOOKINGS}:${userId}`);
      if (!data) return [];
      const bookings = JSON.parse(data) as Booking[];
      // Add default values for old bookings that don't have appointmentType and location
      const normalizedBookings = bookings.map(booking => ({
        ...booking,
        appointmentType: booking.appointmentType || 'First consultation',
        location: booking.location || 'On site',
      }));
      return normalizedBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Error getting bookings:', error);
      return [];
    }
  },

  async getBookingById(userId: string, bookingId: string): Promise<Booking | null> {
    try {
      const bookings = await this.getAllBookings(userId);
      return bookings.find(b => b.id === bookingId) || null;
    } catch (error) {
      console.error('Error getting booking:', error);
      return null;
    }
  },

  async saveBooking(userId: string, booking: Booking): Promise<void> {
    try {
      const bookings = await this.getAllBookings(userId);
      const existingIndex = bookings.findIndex(b => b.id === booking.id);
      
      if (existingIndex >= 0) {
        bookings[existingIndex] = booking;
      } else {
        bookings.push(booking);
      }

      await Storage.setItem(`${STORAGE_KEYS.BOOKINGS}:${userId}`, JSON.stringify(bookings));
    } catch (error) {
      console.error('Error saving booking:', error);
      throw error;
    }
  },

  async createBooking(
    userId: string,
    therapistId: string,
    therapistName: string,
    date: string,
    time: string,
    appointmentType: string,
    location: string
  ): Promise<Booking> {
    const now = new Date().toISOString();
    const booking: Booking = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      therapistId,
      therapistName,
      date,
      time,
      appointmentType,
      location,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    await this.saveBooking(userId, booking);
    return booking;
  },

  async updateBookingStatus(
    userId: string,
    bookingId: string,
    status: Booking['status']
  ): Promise<void> {
    const booking = await this.getBookingById(userId, bookingId);
    if (!booking) throw new Error('Booking not found');

    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    await this.saveBooking(userId, booking);
  },
};
