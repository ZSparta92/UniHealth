export interface Therapist {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  experience: number; // years
  rating: number; // 1-5
  pricePerSession: number;
  available: boolean;
  avatar?: string;
}
