import { useState, useRef, useEffect } from 'react';
import { Friend, UserProfile } from '../types';
import { Users, Send, ArrowLeft, MessageCircle, Heart, Sparkles } from 'lucide-react';

interface FriendsViewProps {
  friends: Friend[];
  userProfile: UserProfile;
  onSendDirectMessage: (friendId: string, content: string) => void;
}

export const FriendsView = ({
  friends,
  userProfile,
  onSendDirectMessage,
}: FriendsViewProps) => {
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(
    friends.length > 0 ? friends[0].id : null
  );
  const [dmText, setDmText] = useState('');
  const dmEndRef = useRef<HTMLDivElement>(null);

  const activeFriend = friends.find((f) => f.id === selectedFriendId) || null;

  useEffect(() => {
    if (dmEndRef.current && typeof dmEndRef.current.scrollIntoView === 'function') {
      dmEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeFriend?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFriend || !dmText.trim()) return;
    onSendDirectMessage(activeFriend.id, dmText.trim());
    setDmText('');
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="friends-view-container">
      {/* Friends Sidebar / List */}
      <div className={`friends-sidebar ${activeFriend ? 'has-selected-mobile-hide' : ''}`}>
        <div className="friends-sidebar-header">
          <Users size={18} />
          <h2>結ばれし縁</h2>
          <span className="friends-count-badge">{friends.length}人</span>
        </div>

        <div className="friends-list">
          {friends.length === 0 ? (
            <div className="empty-friends-box">
              <Sparkles size={32} className="empty-icon" />
              <p>まだ縁が結ばれたお相手はいません。</p>
              <p className="empty-subtext">風に乗せる対話の終了後に、相互で縁を結ぶを選択するとここに表示されます。</p>
            </div>
          ) : (
            friends.map((friend) => (
              <div
                key={friend.id}
                className={`friend-item-card ${friend.id === selectedFriendId ? 'selected' : ''}`}
                onClick={() => setSelectedFriendId(friend.id)}
              >
                <div className="friend-avatar">{friend.avatar || '風'}</div>
                <div className="friend-info">
                  <div className="friend-name-row">
                    <span className="friend-name">{friend.name}</span>
                    <Heart size={14} className="friend-heart-icon" />
                  </div>
                  <p className="friend-last-msg">
                    {friend.messages.length > 0
                      ? friend.messages[friend.messages.length - 1].content
                      : friend.bio}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 1-on-1 Direct Message Panel */}
      <div className={`dm-panel ${!activeFriend ? 'mobile-hide' : ''}`}>
        {activeFriend ? (
          <div className="dm-chat-box">
            <div className="dm-chat-header">
              <button
                className="icon-button mobile-back-btn"
                onClick={() => setSelectedFriendId(null)}
                aria-label="一覧に戻る"
              >
                <ArrowLeft size={18} />
              </button>
              <span className="dm-avatar">{activeFriend.avatar || '風'}</span>
              <div className="dm-header-meta">
                <h3 className="dm-friend-name">{activeFriend.name}様との文通</h3>
                <span className="dm-bio-subtitle">{activeFriend.bio}</span>
              </div>
            </div>

            <div className="dm-messages-area">
              {activeFriend.messages.map((msg) => {
                const isMe = msg.senderId === userProfile.id;
                return (
                  <div key={msg.id} className={`chat-bubble-row ${isMe ? 'me' : 'other'}`}>
                    {!isMe && <div className="bubble-avatar">{activeFriend.avatar || '風'}</div>}
                    <div className="bubble-wrapper">
                      <div className={`chat-bubble ${isMe ? 'bubble-me' : 'bubble-other'}`}>
                        {msg.content}
                      </div>
                      <span className="dm-timestamp">{formatTimestamp(msg.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={dmEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSend}>
              <input
                type="text"
                className="chat-input-field"
                value={dmText}
                onChange={(e) => setDmText(e.target.value)}
                placeholder={`${activeFriend.name}様へ個別の言葉を届ける…`}
                maxLength={300}
              />
              <button
                type="submit"
                className="primary-button"
                disabled={!dmText.trim()}
              >
                <Send size={16} />
                送る
              </button>
            </form>
          </div>
        ) : (
          <div className="empty-dm-placeholder">
            <MessageCircle size={48} className="empty-icon" />
            <p>左側の一覧からお相手を選択すると、1対1の個別メッセージが送れます。</p>
          </div>
        )}
      </div>
    </div>
  );
};
