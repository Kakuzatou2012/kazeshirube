export type ThemeMode = 'dark' | 'light';

export interface UserProfile {
  id: string; // ユーザーID (@id)
  name: string; // 表示名
  bio: string; // 自己紹介文 (初期値は空文字)
  avatar: string;
  email?: string;
  is2FAVerified?: boolean;
  isFrozen?: boolean;
  role?: 'admin' | 'user';
}

export interface AuthAccount {
  id: string; // ユーザーID (@id)
  name: string; // 表示名
  password?: string;
  email: string;
  is2FAVerified: boolean;
  avatar: string;
  bio: string;
  isFrozen?: boolean;
  role?: 'admin' | 'user';
}

export interface UserSettings {
  soundEnabled: boolean;
  theme: ThemeMode;
}

export interface PostReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorIs2FAVerified?: boolean;
  content: string;
  images?: string[];
  createdAt: number;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorIs2FAVerified?: boolean;
  content: string;
  images?: string[];
  createdAt: number;
  likes: number;
  likedByMe?: boolean;
  bookmarkedByMe?: boolean;
  replies?: PostReply[];
}

export interface ReportItem {
  id: string;
  targetType: 'post' | 'chat_message' | 'dm';
  targetId: string;
  targetContent: string;
  authorId: string;
  authorName: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  createdAt: number;
  status: 'pending' | 'resolved';
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  category: '整備' | '更新' | '案内';
  important?: boolean;
}

export interface RoomChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderIs2FAVerified?: boolean;
  content: string;
  images?: string[];
  createdAt: number;
}

export interface ChatRoom {
  id: string;
  title: string;
  description: string;
  createdById: string;
  createdByName: string;
  createdAt: number;
  messages: RoomChatMessage[];
}

export interface DirectMessageItem {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  images?: string[];
  createdAt: number;
}

export interface Friend {
  id: string; // 相手のユーザーID
  name: string;
  avatar: string;
  bio: string;
  is2FAVerified?: boolean;
  connectedAt: number;
  messages: DirectMessageItem[];
}
