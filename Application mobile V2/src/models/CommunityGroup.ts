/**
 * Community Group Chat Data Model
 * 
 * This model represents supervised group chat rooms where:
 * - Only psychologists can create groups
 * - Groups are thematic and limited to 6-7 students
 * - Group names are anonymized codes (e.g., ULY32)
 * - Users can only see groups they are assigned to
 * - All groups are supervised by a psychologist
 */

export interface CommunityGroup {
  id: string;
  code: string; // Anonymized code like "ULY32"
  theme: string; // Thematic topic (e.g., "Anxiety Management", "Study Stress")
  supervisorId: string; // Psychologist ID who created and supervises
  supervisorName: string; // Psychologist name (visible to users)
  memberIds: string[]; // Array of student user IDs (max 6-7)
  maxMembers: number; // Usually 6 or 7
  createdAt: string; // ISO timestamp
  isActive: boolean; // Whether the group is currently active
  description?: string; // Optional description of the group's purpose
}

export interface GroupMessage {
  id: string;
  groupId: string;
  userId: string; // User ID (anonymized in display)
  userDisplayName: string; // Anonymized display name (e.g., "Student A", "Student B")
  message: string;
  timestamp: string; // ISO timestamp
  isOwn: boolean; // Whether this message is from the current user
  isSupervisor: boolean; // Whether this message is from the supervising psychologist
}

export interface GroupMembership {
  userId: string;
  groupId: string;
  joinedAt: string; // ISO timestamp
  displayName: string; // Anonymized display name for this user in this group
}

