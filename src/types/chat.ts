export interface ChatMessage {
  id: string;
  userId: string;
  recommendationId: string;
  message: string;
  timestamp: string;
  replyTo?: string; // ID of the message this is replying to
  likes: number;
  isLiked?: boolean;
}

export interface ChatConversation {
  id: string;
  recommendationId: string;
  participants: string[]; // User IDs
  messages: ChatMessage[];
  lastActivity: string;
  isRead: boolean;
}