import React, { useState, useRef, useEffect } from 'react';
import { Friend, UserProfile } from '../types';
import { Users, Send, ArrowLeft, MessageCircle, Image as ImageIcon, X } from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import { formatTimestamp } from '../utils/formatTimestamp';

interface FriendsViewProps {
  friends: Friend[];
  userProfile: UserProfile;
  onSendDirectMessage: (friendId: string, content: string, images?: string[]) => void;
}

export const FriendsView: React.FC<FriendsViewProps> = React.memo(({
  friends,
  userProfile,
  onSendDirectMessage,
}) => {
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(
    friends.length > 0 ? friends[0].id : null
  );
  const [dmText, setDmText] = useState('');
  const [dmImages, setDmImages] = useState<string[]>([]);
  const dmEndRef = useRef<HTMLDivElement>(null);

  const activeFriend = friends.find((f) => f.id === selectedFriendId) || null;

  useEffect(() => {
    if (dmEndRef.current && typeof dmEndRef.current.scrollIntoView === 'function') {
      dmEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeFriend?.messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 2 * 1024 * 1024) {
      alert('画像サイズは2MB以下で選択してください。');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result && typeof reader.result === 'string') {
        setDmImages((prev) => [...prev, reader.result as string]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFriend || (!dmText.trim() && dmImages.length === 0)) return;

    onSendDirectMessage(activeFriend.id, dmText.trim(), dmImages);
    setDmText('');
    setDmImages([]);
  };

  return (
    <div className="friends-view-container">
      {/* Friends Sidebar */}
      <div className={`friends-sidebar ${activeFriend ? 'has-selected-mobile-hide' : ''}`}>
        <div className="friends-sidebar-header">
          <Users size={18} />
          <h2 style={{ fontSize: '1rem', fontWeight: 600, flex: 1 }}>フレンド一覧</h2>
          <span className="friends-count-badge">{friends.length}人</span>
        </div>

        <div className="friends-list">
          {friends.length === 0 ? (
            <div className="empty-friends-box">
              <p>登録されたフレンドはいません。</p>
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
                    <VerifiedBadge isVerified={friend.is2FAVerified} />
                  </div>
                  <p className="friend-last-msg">
                    {friend.messages.length > 0
                      ? friend.messages[friend.messages.length - 1].content
                      : `@${friend.id}`}
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
                <h3 className="dm-friend-name">
                  {activeFriend.name} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{activeFriend.id}</span>
                </h3>
                <span className="dm-bio-subtitle">{activeFriend.bio || 'ダイレクトメッセージ'}</span>
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
                        {msg.images && msg.images.length > 0 && (
                          <div className="attached-images-grid" style={{ marginTop: '0.5rem' }}>
                            {msg.images.map((img, i) => (
                              <div key={i} className="attached-image-card">
                                <img src={img} alt="添付画像" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="dm-timestamp">{formatTimestamp(msg.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={dmEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSend}>
              {dmImages.length > 0 && (
                <div className="image-preview-container">
                  {dmImages.map((img, i) => (
                    <div key={i} className="image-preview-item">
                      <img src={img} alt="添付プレビュー" />
                      <button
                        type="button"
                        className="image-preview-remove"
                        onClick={() => setDmImages((prev) => prev.filter((_, idx) => idx !== i))}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="chat-input-row">
                <label className="secondary-button" style={{ padding: '0.5rem 0.7rem', cursor: 'pointer' }}>
                  <ImageIcon size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                  />
                </label>

                <input
                  type="text"
                  className="chat-input-field"
                  value={dmText}
                  onChange={(e) => setDmText(e.target.value)}
                  placeholder={`${activeFriend.name} 様へダイレクトメッセージを送信…`}
                  maxLength={300}
                />

                <button
                  type="submit"
                  className="primary-button"
                  disabled={!dmText.trim() && dmImages.length === 0}
                >
                  <Send size={16} />
                  送信
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="empty-dm-placeholder">
            <MessageCircle size={48} className="empty-icon" />
            <p>フレンド一覧から選択すると、1対1のメッセージが送信できます。</p>
          </div>
        )}
      </div>
    </div>
  );
});
