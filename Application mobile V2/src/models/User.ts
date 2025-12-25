export interface User {
  id: string;
  username: string;
  email?: string;
  year?: string; // Optional: L1, L2, L3, M1, M2, etc.
  field?: string; // Optional: Field of study
  createdAt: string;
  lastLoginAt: string;
  isGuest: boolean;
  profileCompleted: boolean;
}

export interface UserProfile {
  username: string;
  email?: string;
  year?: string;
  field?: string;
}
