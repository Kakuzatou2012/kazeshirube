import { Notice, Post, UserProfile, UserSettings } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'user-self',
  name: '旅人',
  bio: '静かな場所を好み、風に乗せて言葉を綴ります。',
  avatar: '風',
};

export const INITIAL_USER_SETTINGS: UserSettings = {
  soundEnabled: true,
  desktopNotifications: false,
  fontSize: 'md',
};

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'notice-1',
    title: '重要 風の整備を行っております',
    content: 'いつも風標をご利用いただき誠にありがとうございます。サイトの安定運用および機能強化のため、整備作業を実施する場合がございます。ご不便をおかけいたしますが今しばらくお待ちくださいませ。',
    date: '2025年01月15日',
    category: '整備',
    important: true,
  },
  {
    id: 'notice-2',
    title: '言葉の佇まいに関する大切なお願い',
    content: '風標は、静かな言葉と一期一会の出会いを尊ぶ場所です。相手を尊重し、心温まる丁寧な日本語での対話をお楽しみいただけますようご協力をお願い申し上げます。',
    date: '2025年01月10日',
    category: '案内',
  },
  {
    id: 'notice-3',
    title: '新機能 対話グループチャットの仕様追加について',
    content: 'マッチング開始から5分以内であれば最大4人まで途中参加が可能となりました。10分間の短くも尊い対話のひとときをお過ごしください。',
    date: '2025年01月05日',
    category: '更新',
  },
];

export const INITIAL_TIMELINE_POSTS: Post[] = [
  {
    id: 'post-1',
    authorId: 'user-kyoto',
    authorName: '古都の閑寂',
    authorAvatar: '古',
    content: '静けさの中に響く風鈴の音が、心の中の迷いを静かに拭い去ってくれる気がします。皆様、本日も穏やかな一日をお過ごしでしょうか。',
    createdAt: Date.now() - 1000 * 60 * 30,
    likes: 5,
  },
  {
    id: 'post-2',
    authorId: 'user-moon',
    authorName: '月影の読書人',
    authorAvatar: '月',
    content: '今夜は月がとても美しく輝いています。温かい茶を淹れて、一冊の古い詩集を開く時間は何物にも代えがたいですね。',
    createdAt: Date.now() - 1000 * 60 * 120,
    likes: 12,
  },
  {
    id: 'post-3',
    authorId: 'user-rain',
    authorName: '雨音のしずく',
    authorAvatar: '雨',
    content: '言葉は風に乗り、見知らぬ誰かの心を少しだけ温めることができる。そんな優しい世界がここにあり続けますように。',
    createdAt: Date.now() - 1000 * 60 * 300,
    likes: 8,
  },
];
