export interface CommunityMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
}
