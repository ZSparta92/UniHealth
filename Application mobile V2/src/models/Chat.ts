export interface ChatMessage {
  id: string;
  therapistId: string;
  senderId: string; // 'user' or therapistId
  senderType: 'user' | 'therapist';
  message: string;
  timestamp: string; // ISO string
}

export interface ChatSession {
  therapistId: string;
  therapistName: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}
