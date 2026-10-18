import { useState, useEffect, useRef } from 'react';
import { MatchRoom, UserProfile } from '../types';
import { Send, LogOut, Clock, Users, AlertCircle, Sparkles } from 'lucide-react';

interface GroupChatViewProps {
  room: MatchRoom;
  userProfile: UserProfile;
  onSendMessage: (text: string) => void;
  onLeaveRoom: () => void;
  onTimerExpire: () => void;
}

export const GroupChatView = ({
  room,
  userProfile,
  onSendMessage,
  onLeaveRoom,
  onTimerExpire,
}: GroupChatViewProps) => {
  const [inputText, setInputText] = useState('');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Timer countdown calculation
  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const remainingMs = room.expiresAt - now;
      const remainingSec = Math.max(0, Math.floor(remainingMs / 1000));
      setTimeLeft(remainingSec);

      if (remainingSec <= 0 && room.status === 'active') {
        onTimerExpire();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [room.expiresAt, room.status, onTimerExpire]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [room.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const disconnectedUsers = room.participants.filter((p) => p.isDisconnected);

  return (
    <div className="group-chat-container">
      {/* Group Chat Top Bar */}
      <div className="chat-header-bar">
        <div className="chat-header-left">
          <div className="timer-badge">
            <Clock size={16} className="timer-icon" />
            <span className="timer-text">{formatTimer(timeLeft)}</span>
          </div>
          <div className="participants-count">
            <Users size={16} />
            <span>{room.participants.length} / 4人</span>
          </div>
        </div>

        <div className="participants-avatars">
          {room.participants.map((p) => (
            <div
              key={p.id}
              className={`participant-chip ${p.isDisconnected ? 'disconnected' : ''}`}
              title={`${p.name}${p.isDisconnected ? ' 一時離脱中' : ''}`}
            >
              <span className="chip-avatar">{p.avatar || '風'}</span>
              <span className="chip-name">{p.name}</span>
            </div>
          ))}
        </div>

        <button
          className="leave-chat-button"
          onClick={onLeaveRoom}
          title="対話を離脱できます"
        >
          <LogOut size={16} />
          身を引く
        </button>
      </div>

      {/* Disconnection Warning Banner */}
      {disconnectedUsers.length > 0 && (
        <div className="disconnection-banner">
          <AlertCircle size={18} className="disconnection-icon" />
          <span>
            風が強まり、{disconnectedUsers.map((u) => u.name).join('様、')}様が飛ばされてしまいました… 再接続を待っています
          </span>
        </div>
      )}

      {/* Late Join Info Notice */}
      {Date.now() < room.joinDeadline && room.participants.length < 4 && (
        <div className="late-join-notice">
          <Sparkles size={16} />
          <span>開始から5分以内です。新しい風の訪問者が途中参加される可能性があります。最大4人まで</span>
        </div>
      )}

      {/* Message History */}
      <div className="chat-messages-area">
        {room.messages.map((msg) => {
          if (msg.isSystem) {
            return (
              <div key={msg.id} className="system-message">
                <span>{msg.content}</span>
              </div>
            );
          }

          const isMe = msg.senderId === userProfile.id;

          return (
            <div key={msg.id} className={`chat-bubble-row ${isMe ? 'me' : 'other'}`}>
              {!isMe && <div className="bubble-avatar">{msg.senderAvatar || '風'}</div>}
              <div className="bubble-wrapper">
                {!isMe && <div className="bubble-sender">{msg.senderName}</div>}
                <div className={`chat-bubble ${isMe ? 'bubble-me' : 'bubble-other'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <form className="chat-input-area" onSubmit={handleSend}>
        <input
          type="text"
          className="chat-input-field"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="言葉を風に乗せて伝える…"
          maxLength={200}
        />
        <button
          type="submit"
          className="primary-button"
          disabled={!inputText.trim()}
        >
          <Send size={16} />
          送信
        </button>
      </form>
    </div>
  );
};
