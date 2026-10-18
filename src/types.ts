export type FontSizeOption = 'sm' | 'md' | 'lg';

export interface UserProfile {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  email?: string;
  is2FAVerified?: boolean;
}

export interface AuthAccount {
  id: string;
  username: string;
  password: string;
  email: string;
  is2FAVerified: boolean;
  avatar: string;
  bio: string;
}

export interface UserSettings {
  soundEnabled: boolean;
  desktopNotifications: boolean;
  fontSize: FontSizeOption;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorIs2FAVerified?: boolean;
  content: string;
  createdAt: number;
  likes: number;
  likedByMe?: boolean;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  category: '整備' | '更新' | '案内';
  important?: boolean;
}

export interface RoomChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderIs2FAVerified?: boolean;
  content: string;
  createdAt: number;
  isSystem?: boolean;
}

export interface MatchRoomParticipant {
  id: string;
  name: string;
  avatar: string;
  is2FAVerified?: boolean;
  isDisconnected?: boolean;
  disconnectTime?: number;
}

export interface MatchRoom {
  id: string;
  createdAt: number;
  expiresAt: number;
  joinDeadline: number;
  participants: MatchRoomParticipant[];
  messages: RoomChatMessage[];
  status: 'active' | 'ended';
  confirmations: Record<string, boolean>;
}

export interface DirectMessageItem {
  id: string;
  senderId: string;
  content: string;
  createdAt: number;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  is2FAVerified?: boolean;
  connectedAt: number;
  messages: DirectMessageItem[];
}
