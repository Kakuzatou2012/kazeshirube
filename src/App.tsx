import { useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  UserSettings,
  Post,
  Notice,
  ChatRoom,
  Friend,
  AuthAccount,
  ReportItem,
} from './types';
import {
  INITIAL_USER_SETTINGS,
  INITIAL_NOTICES,
  INITIAL_TIMELINE_POSTS,
  INITIAL_ACCOUNTS,
  INITIAL_CHAT_ROOMS,
} from './data/initialData';
import { Header } from './components/Header';
import { MaintenanceScreen } from './components/MaintenanceScreen';
import { TimelineView } from './components/TimelineView';
import { GroupChatView } from './components/GroupChatView';
import { FriendsView } from './components/FriendsView';
import { NoticeModal } from './components/NoticeModal';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { InfoDialogModal, InfoModalType } from './components/InfoDialogModal';
import { Footer } from './components/Footer';
import { MessageSquare, Users, MessageCircle } from 'lucide-react';

export default function App() {
  // Maintenance state
  const [isMaintenance, setIsMaintenance] = useState<boolean>(() => {
    const saved = localStorage.getItem('kazeshirube_maintenance');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Saved Auth Accounts
  const [accounts, setAccounts] = useState<AuthAccount[]>(() => {
    const saved = localStorage.getItem('kazeshirube_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  // Current Logged In User Profile (null if unauthenticated)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('kazeshirube_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // User Settings state with theme prefers-color-scheme default
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('kazeshirube_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return {
      ...INITIAL_USER_SETTINGS,
      theme: prefersDark ? 'dark' : 'light',
    };
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', userSettings.theme);
    localStorage.setItem('kazeshirube_settings', JSON.stringify(userSettings));
  }, [userSettings]);

  // Posts / Timeline state
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('kazeshirube_posts');
    return saved ? JSON.parse(saved) : INITIAL_TIMELINE_POSTS;
  });

  // Notices state
  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('kazeshirube_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  // Chat Rooms state
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(() => {
    const saved = localStorage.getItem('kazeshirube_chat_rooms');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_ROOMS;
  });

  // Active Chat Room ID
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  // Friends & DM state
  const [friends, setFriends] = useState<Friend[]>(() => {
    const saved = localStorage.getItem('kazeshirube_friends');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'user_kyoto',
        name: '古都の閑寂',
        avatar: '古',
        bio: '京都の街並みを愛する旅人です。',
        is2FAVerified: false,
        connectedAt: Date.now() - 86400000,
        messages: [
          {
            id: 'dm-1',
            senderId: 'user_kyoto',
            receiverId: 'user_sakura',
            content: 'はじめまして。よろしくお願いいたします。',
            createdAt: Date.now() - 86400000,
          },
        ],
      },
    ];
  });

  // Reports state
  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem('kazeshirube_reports');
    return saved ? JSON.parse(saved) : [];
  });

  // Main Active Tab ('timeline' | 'chat' | 'friends')
  const [activeTab, setActiveTab] = useState<'timeline' | 'chat' | 'friends'>('timeline');

  // Modals state
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [infoModalType, setInfoModalType] = useState<InfoModalType>(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('kazeshirube_maintenance', JSON.stringify(isMaintenance));
  }, [isMaintenance]);

  useEffect(() => {
    localStorage.setItem('kazeshirube_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('kazeshirube_profile', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('kazeshirube_profile');
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('kazeshirube_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('kazeshirube_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('kazeshirube_chat_rooms', JSON.stringify(chatRooms));
  }, [chatRooms]);

  useEffect(() => {
    localStorage.setItem('kazeshirube_friends', JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem('kazeshirube_reports', JSON.stringify(reports));
  }, [reports]);

  // Auth Handlers
  const handleLogin = useCallback((account: AuthAccount) => {
    const profile: UserProfile = {
      id: account.id,
      name: account.name,
      bio: account.bio || '',
      avatar: account.avatar || '風',
      email: account.email,
      is2FAVerified: account.is2FAVerified,
      isFrozen: account.isFrozen,
      role: account.role || (account.id === 'kakuzatou' ? 'admin' : 'user'),
    };
    setUserProfile(profile);
  }, []);

  const handleRegister = useCallback((newAccount: AuthAccount) => {
    setAccounts((prev) => [...prev, newAccount]);
    handleLogin(newAccount);
  }, [handleLogin]);

  const handleLogout = useCallback(() => {
    setUserProfile(null);
    setActiveRoomId(null);
    setActiveTab('timeline');
  }, []);

  const handleVerify2FA = useCallback((email: string) => {
    if (!userProfile) return;
    setUserProfile((prev) => (prev ? { ...prev, email, is2FAVerified: true } : null));
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === userProfile.id ? { ...acc, email, is2FAVerified: true } : acc
      )
    );
  }, [userProfile]);

  // Timeline Handlers
  const handleAddPost = useCallback((content: string, images?: string[]) => {
    if (!userProfile) return;
    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorId: userProfile.id,
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      authorIs2FAVerified: userProfile.is2FAVerified,
      content,
      images,
      createdAt: Date.now(),
      likes: 0,
      replies: [],
    };
    setPosts((prev) => [newPost, ...prev]);
  }, [userProfile]);

  const handleToggleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const likedByMe = !post.likedByMe;
          return {
            ...post,
            likedByMe,
            likes: likedByMe ? post.likes + 1 : Math.max(0, post.likes - 1),
          };
        }
        return post;
      })
    );
  }, []);

  const handleToggleBookmark = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return { ...post, bookmarkedByMe: !post.bookmarkedByMe };
        }
        return post;
      })
    );
  }, []);

  const handleAddReply = useCallback((postId: string, content: string, images?: string[]) => {
    if (!userProfile) return;
    const newReply = {
      id: `reply-${Date.now()}`,
      postId,
      authorId: userProfile.id,
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      authorIs2FAVerified: userProfile.is2FAVerified,
      content,
      images,
      createdAt: Date.now(),
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            replies: [...(post.replies || []), newReply],
          };
        }
        return post;
      })
    );
  }, [userProfile]);

  const handleReportPost = useCallback((
    postId: string,
    postContent: string,
    authorId: string,
    authorName: string,
    reason: string
  ) => {
    if (!userProfile) return;
    const newReport: ReportItem = {
      id: `report-${Date.now()}`,
      targetType: 'post',
      targetId: postId,
      targetContent: postContent,
      authorId,
      authorName,
      reporterId: userProfile.id,
      reporterName: userProfile.name,
      reason,
      createdAt: Date.now(),
      status: 'pending',
    };
    setReports((prev) => [newReport, ...prev]);
  }, [userProfile]);

  // Chat Room Handlers
  const handleCreateRoom = useCallback((title: string, description: string) => {
    if (!userProfile) return;
    const newRoom: ChatRoom = {
      id: `room-${Date.now()}`,
      title,
      description,
      createdById: userProfile.id,
      createdByName: userProfile.name,
      createdAt: Date.now(),
      messages: [],
    };
    setChatRooms((prev) => [newRoom, ...prev]);
    setActiveRoomId(newRoom.id);
  }, [userProfile]);

  const handleJoinRoom = useCallback((roomId: string) => {
    setActiveRoomId(roomId);
  }, []);

  const handleLeaveRoom = useCallback(() => {
    setActiveRoomId(null);
  }, []);

  const handleSendChatMessage = useCallback((roomId: string, content: string, images?: string[]) => {
    if (!userProfile) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      roomId,
      senderId: userProfile.id,
      senderName: userProfile.name,
      senderAvatar: userProfile.avatar,
      senderIs2FAVerified: userProfile.is2FAVerified,
      content,
      images,
      createdAt: Date.now(),
    };

    setChatRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, messages: [...r.messages, newMsg] } : r))
    );
  }, [userProfile]);

  // DM Handlers
  const handleSendDirectMessage = useCallback((friendId: string, content: string, images?: string[]) => {
    if (!userProfile) return;
    const newMsg = {
      id: `dm-${Date.now()}`,
      senderId: userProfile.id,
      receiverId: friendId,
      content,
      images,
      createdAt: Date.now(),
    };

    setFriends((prev) =>
      prev.map((f) => (f.id === friendId ? { ...f, messages: [...f.messages, newMsg] } : f))
    );
  }, [userProfile]);

  // Admin Handlers (@kakuzatou)
  const handleToggleFreezeUser = useCallback((targetUserId: string) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === targetUserId ? { ...acc, isFrozen: !acc.isFrozen } : acc))
    );
  }, []);

  const handleAddNotice = useCallback((notice: Notice) => {
    setNotices((prev) => [notice, ...prev]);
  }, []);

  const handleEditNotice = useCallback((updatedNotice: Notice) => {
    setNotices((prev) => prev.map((n) => (n.id === updatedNotice.id ? updatedNotice : n)));
  }, []);

  const handleDeleteNotice = useCallback((noticeId: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== noticeId));
  }, []);

  const handleResolveReport = useCallback((reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved' as const } : r))
    );
  }, []);

  const handleDeleteReportedContent = useCallback((report: ReportItem) => {
    if (report.targetType === 'post') {
      setPosts((prev) => prev.filter((p) => p.id !== report.targetId));
    }
    handleResolveReport(report.id);
  }, [handleResolveReport]);

  // Account Data Deletion
  const handleDeleteAccountData = useCallback(() => {
    localStorage.clear();
    setUserProfile(null);
    setAccounts(INITIAL_ACCOUNTS);
    setUserSettings(INITIAL_USER_SETTINGS);
    setPosts(INITIAL_TIMELINE_POSTS);
    setNotices(INITIAL_NOTICES);
    setChatRooms(INITIAL_CHAT_ROOMS);
    setFriends([]);
    setReports([]);
    setIsMaintenance(false);
  }, []);

  if (isMaintenance) {
    return (
      <div className="app-container">
        <MaintenanceScreen
          notices={notices}
          onToggleMaintenance={() => setIsMaintenance(false)}
          onOpenNoticeModal={() => setIsNoticeModalOpen(true)}
        />
        <NoticeModal
          isOpen={isNoticeModalOpen}
          onClose={() => setIsNoticeModalOpen(false)}
          notices={notices}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <Header
        userProfile={userProfile}
        onOpenNoticeModal={() => setIsNoticeModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onGoHome={() => setActiveTab('timeline')}
      />

      {/* Main Content Layout or Forced Authentication Screen */}
      {!userProfile ? (
        <main className="main-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AuthModal
            isOpen={true}
            isForcedLogin={true}
            currentUser={null}
            accounts={accounts}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onVerify2FA={handleVerify2FA}
          />
        </main>
      ) : (
        <main className="main-layout">
          {/* Navigation Tabs */}
          <nav className="nav-tabs">
            <button
              type="button"
              className={`nav-tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              <MessageSquare size={18} />
              全体タイムライン
            </button>

            <button
              type="button"
              className={`nav-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <Users size={18} />
              チャットルーム
            </button>

            <button
              type="button"
              className={`nav-tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
              onClick={() => setActiveTab('friends')}
            >
              <MessageCircle size={18} />
              ダイレクトメッセージ
            </button>
          </nav>

          {/* Tab Views */}
          {activeTab === 'timeline' && (
            <TimelineView
              posts={posts}
              userProfile={userProfile}
              onAddPost={handleAddPost}
              onToggleLike={handleToggleLike}
              onToggleBookmark={handleToggleBookmark}
              onAddReply={handleAddReply}
              onReportPost={handleReportPost}
            />
          )}

          {activeTab === 'chat' && (
            <GroupChatView
              rooms={chatRooms}
              activeRoomId={activeRoomId}
              userProfile={userProfile}
              onCreateRoom={handleCreateRoom}
              onJoinRoom={handleJoinRoom}
              onLeaveRoom={handleLeaveRoom}
              onSendMessage={handleSendChatMessage}
            />
          )}

          {activeTab === 'friends' && (
            <FriendsView
              friends={friends}
              userProfile={userProfile}
              onSendDirectMessage={handleSendDirectMessage}
            />
          )}
        </main>
      )}

      {/* Footer */}
      <Footer
        onOpenInfoModal={(type) => setInfoModalType(type)}
        onOpenNoticeModal={() => setIsNoticeModalOpen(true)}
      />

      {/* Modals */}
      <NoticeModal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        notices={notices}
      />

      {userProfile && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          profile={userProfile}
          onSaveProfile={(updated) => setUserProfile(updated)}
          onLogout={handleLogout}
        />
      )}

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={userSettings}
        onUpdateSettings={(newSettings) => setUserSettings(newSettings)}
        onDeleteAccountData={handleDeleteAccountData}
      />

      {isAuthModalOpen && userProfile && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          currentUser={userProfile}
          accounts={accounts}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onVerify2FA={handleVerify2FA}
        />
      )}

      {userProfile?.role === 'admin' && (
        <AdminPanelModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          accounts={accounts}
          notices={notices}
          reports={reports}
          onToggleFreezeUser={handleToggleFreezeUser}
          onAddNotice={handleAddNotice}
          onEditNotice={handleEditNotice}
          onDeleteNotice={handleDeleteNotice}
          onResolveReport={handleResolveReport}
          onDeleteReportedContent={handleDeleteReportedContent}
        />
      )}

      <InfoDialogModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />
    </div>
  );
}
