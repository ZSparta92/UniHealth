export interface Booking {
  id: string;
  userId: string;
  therapistId: string;
  therapistName: string;
  date: string; // ISO string
  time: string; // HH:mm format
  appointmentType: string;
  location: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}
