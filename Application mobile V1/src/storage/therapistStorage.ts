import { Therapist } from '../models/Therapist';

// Mock therapists data
const MOCK_THERAPISTS: Therapist[] = [
  {
    id: 'therapist_1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Anxiety & Stress Management',
    bio: 'Licensed clinical psychologist with over 10 years of experience helping students manage anxiety, stress, and academic pressures. Specializes in cognitive-behavioral therapy and mindfulness techniques.',
    experience: 10,
    rating: 4.8,
    pricePerSession: 120,
    available: true,
  },
  {
    id: 'therapist_2',
    name: 'Dr. Michael Chen',
    specialization: 'Depression & Mood Disorders',
    bio: 'Experienced therapist focusing on depression, mood regulation, and helping students navigate life transitions. Uses evidence-based approaches including DBT and person-centered therapy.',
    experience: 8,
    rating: 4.9,
    pricePerSession: 100,
    available: true,
  },
];

export const TherapistStorage = {
  async getAllTherapists(): Promise<Therapist[]> {
    // Simulate async operation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_THERAPISTS);
      }, 100);
    });
  },

  async getTherapistById(therapistId: string): Promise<Therapist | null> {
    const therapists = await this.getAllTherapists();
    return therapists.find(t => t.id === therapistId) || null;
  },
};
