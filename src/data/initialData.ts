import { Notice, Post, UserProfile, UserSettings, AuthAccount, ChatRoom } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'user_sakura',
  name: '桜井',
  bio: '',
  avatar: '桜',
  email: 'sakura@example.com',
  is2FAVerified: true,
  role: 'user',
};

export const ADMIN_ACCOUNT: AuthAccount = {
  id: 'kakuzatou',
  name: '運営管理者',
  password: 'adminpassword',
  email: 'kakuzatou@kazeshirube.jp',
  is2FAVerified: true,
  avatar: '統',
  bio: '風標の運営管理アカウントです。',
  role: 'admin',
};

export const INITIAL_ACCOUNTS: AuthAccount[] = [
  ADMIN_ACCOUNT,
  {
    id: 'user_sakura',
    name: '桜井',
    password: 'password123',
    email: 'sakura@example.com',
    is2FAVerified: true,
    avatar: '桜',
    bio: '',
    role: 'user',
  },
  {
    id: 'user_kyoto',
    name: '古都の閑寂',
    password: 'password123',
    email: 'kyoto@example.com',
    is2FAVerified: false,
    avatar: '古',
    bio: '京都の古い街並みを愛する旅人です。',
    role: 'user',
  },
];

export const INITIAL_USER_SETTINGS: UserSettings = {
  soundEnabled: true,
  theme: 'dark',
};

const NOW = Date.now();
const ONE_HOUR = 3600 * 1000;
const ONE_DAY = 24 * ONE_HOUR;

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'notice-1',
    title: '風標の設備保守点検につきまして',
    content: 'いつも風標をご利用いただき誠にありがとうございます。サービスの安定運用のために定期点検を実施しております。ご協力をお願い申し上げます。',
    createdAt: NOW - ONE_DAY * 2,
    category: '整備',
    important: true,
  },
  {
    id: 'notice-2',
    title: '言葉の佇まいに関するお願い',
    content: '風標は、穏やかな言葉と心地よい対話を大切にするコミュニティです。互いを尊重し、丁寧な言葉遣いでの対話をお願いいたします。',
    createdAt: NOW - ONE_DAY * 5,
    category: '案内',
  },
  {
    id: 'notice-3',
    title: 'オープンチャットルーム機能および画像添付機能の追加',
    content: '誰でも自由にテーマを設定できるオープンチャットルーム機能と、タイムライン・チャットへの画像添付機能を追加いたしました。',
    createdAt: NOW - ONE_DAY * 10,
    category: '更新',
  },
];

export const INITIAL_TIMELINE_POSTS: Post[] = [
  {
    id: 'post-1',
    authorId: 'user_kyoto',
    authorName: '古都の閑寂',
    authorAvatar: '古',
    authorIs2FAVerified: false,
    content: '静けさの中に響く風鈴の音が、心の中の迷いを静かに拭い去ってくれる気がします。皆様、本日も穏やかな一日をお過ごしでしょうか。',
    createdAt: NOW - ONE_HOUR * 2,
    likes: 5,
    replies: [
      {
        id: 'reply-1',
        postId: 'post-1',
        authorId: 'user_sakura',
        authorName: '桜井',
        authorAvatar: '桜',
        authorIs2FAVerified: true,
        content: '風鈴の音色は心が落ち着きますね。素敵な投稿をありがとうございます。',
        createdAt: NOW - ONE_HOUR * 1,
      },
    ],
  },
  {
    id: 'post-2',
    authorId: 'user_moon',
    authorName: '月影の読書人',
    authorAvatar: '月',
    authorIs2FAVerified: true,
    content: '今夜は月がとても美しく輝いています。温かい茶を淹れて、一冊の古い詩集を開く時間は何物にも代えがたいですね。',
    createdAt: NOW - ONE_HOUR * 5,
    likes: 12,
    replies: [],
  },
];

export const INITIAL_CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'room-1',
    title: '読書と珈琲の部屋',
    description: 'お気に入りの本や珈琲について静かに語り合うお部屋です。',
    createdById: 'user_moon',
    createdByName: '月影の読書人',
    createdAt: NOW - ONE_HOUR * 3,
    messages: [
      {
        id: 'msg-101',
        roomId: 'room-1',
        senderId: 'user_moon',
        senderName: '月影の読書人',
        senderAvatar: '月',
        senderIs2FAVerified: true,
        content: 'ようこそ。最近読んで心に残った一冊はありますか。',
        createdAt: NOW - ONE_HOUR * 3,
      },
    ],
  },
  {
    id: 'room-2',
    title: '夕暮れの雑談部屋',
    description: '今日あったことや気になった出来事をゆったりと共有しましょう。',
    createdById: 'user_kyoto',
    createdByName: '古都の閑寂',
    createdAt: NOW - ONE_HOUR * 1,
    messages: [],
  },
];
