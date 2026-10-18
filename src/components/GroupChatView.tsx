import React, { useState, useRef, useEffect } from 'react';
import { ChatRoom, UserProfile } from '../types';
import { Send, LogOut, MessageCircle, Plus, Image as ImageIcon, X, ArrowLeft } from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import { formatTimestamp } from '../utils/formatTimestamp';

interface GroupChatViewProps {
  rooms: ChatRoom[];
  activeRoomId: string | null;
  userProfile: UserProfile;
  onCreateRoom: (title: string, description: string) => void;
  onJoinRoom: (roomId: string) => void;
  onLeaveRoom: () => void;
  onSendMessage: (roomId: string, text: string, images?: string[]) => void;
}

export const GroupChatView: React.FC<GroupChatViewProps> = React.memo(({
  rooms,
  activeRoomId,
  userProfile,
  onCreateRoom,
  onJoinRoom,
  onLeaveRoom,
  onSendMessage,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');

  const [inputText, setInputText] = useState('');
  const [chatImages, setChatImages] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || null;

  // Auto-scroll to bottom of chat messages
  useEffect(() => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeRoom?.messages]);

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
        setChatImages((prev) => [...prev, reader.result as string]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRoom || (!inputText.trim() && chatImages.length === 0)) return;

    onSendMessage(activeRoom.id, inputText.trim(), chatImages);
    setInputText('');
    setChatImages([]);
  };

  const handleCreateRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomTitle.trim()) return;

    onCreateRoom(newRoomTitle.trim(), newRoomDesc.trim());
    setNewRoomTitle('');
    setNewRoomDesc('');
    setIsCreateModalOpen(false);
  };

  const renderTextWithMentions = (text: string) => {
    const parts = text.split(/(@[a-zA-Z0-9_]+)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('@')) {
        return (
          <span key={idx} style={{ color: 'var(--accent-teal)', fontWeight: 600 }}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Render Room List view if no room active
  if (!activeRoom) {
    return (
      <div className="timeline-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>リアルタイムチャットルーム</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>自由なテーマで交流できるチャットルーム一覧です。</p>
          </div>
          <button
            type="button"
            className="primary-button"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} /> ルームを作成
          </button>
        </div>

        <div className="chat-room-list">
          {rooms.length === 0 ? (
            <div className="empty-posts-state">
              <MessageCircle size={36} className="empty-icon" />
              <p>現在オープンしているルームはありません。</p>
              <p className="empty-subtext">新しいルームを作成してみましょう。</p>
            </div>
          ) : (
            rooms.map((room) => (
              <div key={room.id} className="chat-room-card">
                <div className="chat-room-info">
                  <h3>{room.title}</h3>
                  <p>{room.description || 'テーマ設定なし'}</p>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    作成者: {room.createdByName} • {formatTimestamp(room.createdAt)}
                  </div>
                </div>
                <button
                  type="button"
                  className="primary-button"
                  style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                  onClick={() => onJoinRoom(room.id)}
                >
                  入室する
                </button>
              </div>
            ))
          )}
        </div>

        {/* Create Room Modal */}
        {isCreateModalOpen && (
          <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-header-title">
                  <Plus size={20} className="modal-title-icon" />
                  <h2>新規チャットルームの作成</h2>
                </div>
                <button className="icon-button" onClick={() => setIsCreateModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateRoomSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label" htmlFor="room-title">
                      ルーム名 (テーマ)
                    </label>
                    <input
                      id="room-title"
                      type="text"
                      className="form-input"
                      value={newRoomTitle}
                      onChange={(e) => setNewRoomTitle(e.target.value)}
                      placeholder="例: 京都の観光スポットを語る部屋"
                      maxLength={30}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="room-desc">
                      説明・案内文
                    </label>
                    <textarea
                      id="room-desc"
                      className="form-textarea"
                      value={newRoomDesc}
                      onChange={(e) => setNewRoomDesc(e.target.value)}
                      placeholder="このお部屋での会話テーマや簡単な案内を入力してください…"
                      maxLength={100}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="secondary-button" onClick={() => setIsCreateModalOpen(false)}>
                    キャンセル
                  </button>
                  <button type="submit" className="primary-button">
                    作成して入室
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active Chat Room View
  return (
    <div className="chat-container">
      {/* Top Header Bar */}
      <div className="chat-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            className="icon-button"
            onClick={onLeaveRoom}
            title="ルーム一覧へ戻る"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{activeRoom.title}</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{activeRoom.description}</span>
          </div>
        </div>

        <button
          type="button"
          className="secondary-button"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
          onClick={onLeaveRoom}
        >
          <LogOut size={15} /> 退室
        </button>
      </div>

      {/* Messages Area */}
      <div className="chat-messages-area">
        {activeRoom.messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            メッセージはまだありません。最初の発言を投稿してみましょう。
          </div>
        ) : (
          activeRoom.messages.map((msg) => {
            const isMe = msg.senderId === userProfile.id;

            return (
              <div key={msg.id} className={`chat-bubble-row ${isMe ? 'me' : 'other'}`}>
                {!isMe && <div className="bubble-avatar">{msg.senderAvatar || '風'}</div>}
                <div className="bubble-wrapper">
                  {!isMe && (
                    <div className="bubble-sender">
                      {msg.senderName} <span style={{ fontSize: '0.7rem' }}>@{msg.senderId}</span>
                      <VerifiedBadge isVerified={msg.senderIs2FAVerified} />
                    </div>
                  )}
                  <div className={`chat-bubble ${isMe ? 'bubble-me' : 'bubble-other'}`}>
                    {renderTextWithMentions(msg.content)}
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
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem', alignSelf: isMe ? 'flex-end' : 'flex-start' }}>
                    {formatTimestamp(msg.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <form className="chat-input-area" onSubmit={handleSend}>
        {chatImages.length > 0 && (
          <div className="image-preview-container">
            {chatImages.map((img, i) => (
              <div key={i} className="image-preview-item">
                <img src={img} alt="添付プレビュー" />
                <button
                  type="button"
                  className="image-preview-remove"
                  onClick={() => setChatImages((prev) => prev.filter((_, idx) => idx !== i))}
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
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="メッセージや @ユーザーID を入力…"
            maxLength={200}
          />

          <button
            type="submit"
            className="primary-button"
            disabled={!inputText.trim() && chatImages.length === 0}
          >
            <Send size={16} />
            送信
          </button>
        </div>
      </form>
    </div>
  );
});
