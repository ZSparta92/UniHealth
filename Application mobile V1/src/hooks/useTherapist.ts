import { useState, useEffect } from 'react';
import { Therapist } from '../models/Therapist';
import { TherapistStorage } from '../storage/therapistStorage';

export const useTherapist = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTherapists();
  }, []);

  const loadTherapists = async () => {
    try {
      setLoading(true);
      const data = await TherapistStorage.getAllTherapists();
      setTherapists(data);
    } catch (error) {
      console.error('Error loading therapists:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTherapistById = async (therapistId: string): Promise<Therapist | null> => {
    return await TherapistStorage.getTherapistById(therapistId);
  };

  return {
    therapists,
    loading,
    getTherapistById,
    refreshTherapists: loadTherapists,
  };
};
