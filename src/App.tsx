import { useState, useEffect } from 'react';
import {
  UserProfile,
  UserSettings,
  Post,
  Notice,
  MatchRoom,
  Friend,
  MatchRoomParticipant,
  AuthAccount,
} from './types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_USER_SETTINGS,
  INITIAL_NOTICES,
  INITIAL_TIMELINE_POSTS,
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
import { InfoDialogModal, InfoModalType } from './components/InfoDialogModal';
import { FriendConfirmationModal } from './components/FriendConfirmationModal';
import { Footer } from './components/Footer';
import { MessageSquare, Users, MessageCircle } from 'lucide-react';

export default function App() {
  // Maintenance state (Default: false)
  const [isMaintenance, setIsMaintenance] = useState<boolean>(() => {
    const saved = localStorage.getItem('kazeshirube_maintenance');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Saved Auth Accounts
  const [accounts, setAccounts] = useState<AuthAccount[]>(() => {
    const saved = localStorage.getItem('kazeshirube_accounts');
    return saved ? JSON.parse(saved) : [];
  });

  // User Profile state
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('kazeshirube_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  // User Settings state
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('kazeshirube_settings');
    return saved ? JSON.parse(saved) : INITIAL_USER_SETTINGS;
  });

  // Posts / Timeline state
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('kazeshirube_posts');
    return saved ? JSON.parse(saved) : INITIAL_TIMELINE_POSTS;
  });

  // Notices state
  const [notices] = useState<Notice[]>(INITIAL_NOTICES);

  // Friends state
  const [friends, setFriends] = useState<Friend[]>(() => {
    const saved = localStorage.getItem('kazeshirube_friends');
    return saved ? JSON.parse(saved) : [];
  });

  // Matching & Chat State
  const [isMatchingWaiting, setIsMatchingWaiting] = useState<boolean>(false);
  const [currentRoom, setCurrentRoom] = useState<MatchRoom | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'chat' | 'friends'>('timeline');

  // Modals state
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [infoModalType, setInfoModalType] = useState<InfoModalType>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<boolean>(false);
  const [finishedParticipants, setFinishedParticipants] = useState<MatchRoomParticipant[]>([]);

  // Apply font size class
  useEffect(() => {
    document.body.className = `font-${userSettings.fontSize}`;
    localStorage.setItem('kazeshirube_settings', JSON.stringify(userSettings));
  }, [userSettings]);

  // Save state in localStorage
  useEffect(() => {
    localStorage.setItem('kazeshirube_maintenance', JSON.stringify(isMaintenance));
  }, [isMaintenance]);

  useEffect(() => {
    localStorage.setItem('kazeshirube_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('kazeshirube_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('kazeshirube_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('kazeshirube_friends', JSON.stringify(friends));
  }, [friends]);

  // Handle Login
  const handleLogin = (account: AuthAccount) => {
    setUserProfile({
      id: account.id,
      name: account.username,
      bio: account.bio,
      avatar: account.avatar,
      email: account.email,
      is2FAVerified: account.is2FAVerified,
    });
  };

  // Handle Register
  const handleRegister = (newAccount: AuthAccount) => {
    setAccounts((prev) => [...prev, newAccount]);
    handleLogin(newAccount);
  };

  // Handle Verify 2FA
  const handleVerify2FA = (email: string) => {
    setUserProfile((prev) => ({
      ...prev,
      email,
      is2FAVerified: true,
    }));

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === userProfile.id ? { ...acc, email, is2FAVerified: true } : acc
      )
    );
  };

  // Handle Start Matching
  const handleStartMatching = () => {
    if (isMatchingWaiting || currentRoom) return;
    setIsMatchingWaiting(true);

    setTimeout(() => {
      const now = Date.now();
      const mockOnlineUsers: MatchRoomParticipant[] = [
        {
          id: userProfile.id,
          name: userProfile.name,
          avatar: userProfile.avatar,
          is2FAVerified: userProfile.is2FAVerified,
        },
        { id: 'user-maple', name: '紅葉の長老', avatar: '楓', is2FAVerified: true },
        { id: 'user-sakura', name: '春風の旅人', avatar: '桜' },
      ];

      const newRoom: MatchRoom = {
        id: `room-${now}`,
        createdAt: now,
        expiresAt: now + 10 * 60 * 1000,
        joinDeadline: now + 5 * 60 * 1000,
        participants: mockOnlineUsers,
        messages: [
          {
            id: `sys-${now}`,
            senderId: 'system',
            senderName: '風標',
            senderAvatar: '風',
            content: '風が結びし対話の部屋がひらかれました。10分間の短くも尊いひとときをお過ごしください。',
            createdAt: now,
            isSystem: true,
          },
          {
            id: `msg-1-${now}`,
            senderId: 'user-maple',
            senderName: '紅葉の長老',
            senderAvatar: '楓',
            senderIs2FAVerified: true,
            content: '風に身を任せてやってまいりました。どうぞよろしくお願いいたします。',
            createdAt: now + 500,
          },
        ],
        status: 'active',
        confirmations: {},
      };

      setCurrentRoom(newRoom);
      setIsMatchingWaiting(false);
      setActiveTab('chat');
    }, 2500);
  };

  // Handle Add Timeline Post
  const handleAddPost = (content: string) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorId: userProfile.id,
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      authorIs2FAVerified: userProfile.is2FAVerified,
      content,
      createdAt: Date.now(),
      likes: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  // Handle Toggle Like
  const handleToggleLike = (postId: string) => {
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
  };

  // Handle Send Group Chat Message
  const handleSendGroupMessage = (text: string) => {
    if (!currentRoom) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: userProfile.id,
      senderName: userProfile.name,
      senderAvatar: userProfile.avatar,
      senderIs2FAVerified: userProfile.is2FAVerified,
      content: text,
      createdAt: Date.now(),
    };

    setCurrentRoom((prev) => (prev ? { ...prev, messages: [...prev.messages, newMsg] } : null));

    setTimeout(() => {
      setCurrentRoom((prev) => {
        if (!prev || prev.status !== 'active') return prev;
        const otherParticipant = prev.participants.find(
          (p) => p.id !== userProfile.id && !p.isDisconnected
        );
        if (!otherParticipant) return prev;

        const botReply = {
          id: `msg-reply-${Date.now()}`,
          senderId: otherParticipant.id,
          senderName: otherParticipant.name,
          senderAvatar: otherParticipant.avatar,
          senderIs2FAVerified: otherParticipant.is2FAVerified,
          content: '温かい言葉をありがとうございます。風が心地よく響いてまいります。',
          createdAt: Date.now(),
        };

        return { ...prev, messages: [...prev.messages, botReply] };
      });
    }, 3000);
  };

  // Handle Leave Group Chat
  const handleFinishRoom = () => {
    if (!currentRoom) return;
    setFinishedParticipants(currentRoom.participants);
    setCurrentRoom(null);
    setActiveTab('timeline');
    setIsConfirmationModalOpen(true);
  };

  // Handle Send Direct Message
  const handleSendDirectMessage = (friendId: string, content: string) => {
    setFriends((prev) =>
      prev.map((f) => {
        if (f.id === friendId) {
          const newMsg = {
            id: `dm-${Date.now()}`,
            senderId: userProfile.id,
            content,
            createdAt: Date.now(),
          };
          return {
            ...f,
            messages: [...f.messages, newMsg],
          };
        }
        return f;
      })
    );
  };

  // Handle Friend Connection Confirmation
  const handleConfirmFriendship = (newFriends: Friend[]) => {
    setFriends((prev) => {
      const existingIds = new Set(prev.map((f) => f.id));
      const added = newFriends.filter((nf) => !existingIds.has(nf.id));
      return [...prev, ...added];
    });
  };

  // Handle Data Reset
  const handleResetData = () => {
    localStorage.clear();
    setAccounts([]);
    setUserProfile(INITIAL_USER_PROFILE);
    setUserSettings(INITIAL_USER_SETTINGS);
    setPosts(INITIAL_TIMELINE_POSTS);
    setFriends([]);
    setIsMaintenance(false);
  };

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
        isMatchingWaiting={isMatchingWaiting}
        isInChat={!!currentRoom}
        onStartMatching={handleStartMatching}
        onOpenNoticeModal={() => setIsNoticeModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onGoHome={() => setActiveTab('timeline')}
      />

      {/* Main Content Layout */}
      <main className="main-layout">
        {/* Navigation Tabs */}
        <nav className="nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            <MessageSquare size={18} />
            全体タイムライン
          </button>

          {currentRoom && (
            <button
              className={`nav-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <Users size={18} />
              10分対話部屋
            </button>
          )}

          <button
            className={`nav-tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            <MessageCircle size={18} />
            結ばれし縁
          </button>
        </nav>

        {/* Tab Views */}
        {activeTab === 'timeline' && (
          <TimelineView
            posts={posts}
            userProfile={userProfile}
            onAddPost={handleAddPost}
            onToggleLike={handleToggleLike}
          />
        )}

        {activeTab === 'chat' && currentRoom && (
          <GroupChatView
            room={currentRoom}
            userProfile={userProfile}
            onSendMessage={handleSendGroupMessage}
            onLeaveRoom={handleFinishRoom}
            onTimerExpire={handleFinishRoom}
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

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={userProfile}
        onSaveProfile={(updated) => setUserProfile(updated)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={userSettings}
        onUpdateSettings={(newSettings) => setUserSettings(newSettings)}
        onResetData={handleResetData}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={userProfile}
        accounts={accounts}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onVerify2FA={handleVerify2FA}
      />

      <InfoDialogModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

      <FriendConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        participants={finishedParticipants}
        selfId={userProfile.id}
        onConfirmFriendship={handleConfirmFriendship}
      />
    </div>
  );
}
