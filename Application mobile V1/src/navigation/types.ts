export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Onboarding: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  CommunityChat: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  MoodEntry: undefined;
  MoodHistory: undefined;
  MoodDetail: { moodId: string };
  SavorMoment: undefined;
};

export type ActivitiesStackParamList = {
  Activities: undefined;
  ActivityDetail: { activityId: string };
  ActivitySession: { activityId: string };
  CustomActivity: { activityId?: string };
};

export type JournalStackParamList = {
  JournalList: undefined;
  JournalEntry: { entryId?: string };
  JournalDetail: { entryId: string };
  JournalSearch: undefined;
};

export type ResourcesStackParamList = {
  Resources: undefined;
  ResourceDetail: { resourceId: string };
  EmergencyContacts: undefined;
  BreathingExercise: undefined;
  TherapistList: undefined;
  TherapistDetail: { therapistId: string };
  Booking: { therapistId: string; therapistName: string };
  BookingConfirmation: { bookingId: string };
  Chat: { therapistId: string; therapistName: string };
  MyBookings: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  Settings: undefined;
  Privacy: undefined;
  DataExport: undefined;
  About: undefined;
};
