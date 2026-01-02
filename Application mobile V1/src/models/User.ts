export interface User {
  id: string;
  username: string;
  email?: string;
  createdAt: string;
  lastLoginAt: string;
  isGuest: boolean;
  profileCompleted: boolean;
}

export interface UserProfile {
  username: string;
  email?: string;
}
