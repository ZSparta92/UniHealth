export const STORAGE_KEYS = {
  // Authentication
  USER_ID: '@app:user_id',
  USER_DATA: '@app:user_data',
  IS_FIRST_LAUNCH: '@app:is_first_launch',
  ONBOARDING_COMPLETED: '@app:onboarding_completed',
  IS_GUEST: '@app:is_guest',
  // Theme
  THEME_MODE: '@app:theme_mode',
  // Mood entries
  MOOD_ENTRIES: '@app:mood_entries',
  // Journal entries
  JOURNAL_ENTRIES: '@app:journal_entries',
  // Activities
  ACTIVITIES: '@app:activities',
  ACTIVITY_SESSIONS: '@app:activity_sessions',
  // Bookings
  BOOKINGS: '@app:bookings',
  // Chat
  CHAT_MESSAGES: '@app:chat_messages',
  CHAT_SESSIONS: '@app:chat_sessions',
  // Community Chat
  COMMUNITY_CHAT_MESSAGES: '@app:community_chat_messages',
  // Community Groups
  COMMUNITY_GROUPS: '@app:community_groups',
  COMMUNITY_GROUP_MESSAGES: '@app:community_group_messages',
  COMMUNITY_GROUP_MEMBERSHIPS: '@app:community_group_memberships',
} as const;
