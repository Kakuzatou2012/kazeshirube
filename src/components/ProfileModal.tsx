import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { User, X, Check, AtSign, Crown } from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  onLogout?: () => void;
}

const AVATAR_PRESETS = ['風', '月', '雨', '雲', '雪', '花', '竹', '鳥', '光', '影', '旅', '道', '統'];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onLogout,
}) => {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio || '');
  const [avatar, setAvatar] = useState(profile.avatar || '風');

  useEffect(() => {
    setName(profile.name);
    setBio(profile.bio || '');
    setAvatar(profile.avatar || '風');
  }, [profile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      name: name.trim() || profile.id,
      bio: bio.trim(),
      avatar,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <User size={20} className="modal-title-icon" />
            <h2>マイページ プロフィール設定</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="閉じる">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* User ID Field (@id - Unchangeable) */}
            <div className="form-group">
              <label className="form-label" htmlFor="mypage-user-id">
                <AtSign size={14} /> ユーザーID (@id)
              </label>
              <input
                id="mypage-user-id"
                type="text"
                className="form-input"
                value={`@${profile.id}`}
                disabled
                style={{ opacity: 0.7, backgroundColor: 'var(--bg-primary)', cursor: 'not-allowed' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
                ※ ユーザーID (@id) は登録後の変更はできません。
              </span>
            </div>

            {/* Display Name Field (Editable) */}
            <div className="form-group">
              <label className="form-label" htmlFor="mypage-name">
                表示名 (名前)
              </label>
              <input
                id="mypage-name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                required
              />
            </div>

            {/* Avatar Preset Selection */}
            <div className="form-group">
              <label className="form-label">アイコン 意匠の選択</label>
              <div className="avatar-preset-grid">
                {AVATAR_PRESETS.map((char) => (
                  <button
                    type="button"
                    key={char}
                    className={`avatar-preset-btn ${avatar === char ? 'selected' : ''}`}
                    onClick={() => setAvatar(char)}
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>

            {/* Bio Editing */}
            <div className="form-group">
              <label className="form-label" htmlFor="mypage-bio">
                自己紹介文
              </label>
              <textarea
                id="mypage-bio"
                className="form-textarea"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={150}
                rows={3}
                placeholder="自己紹介文を入力してください…"
              />
            </div>

            {/* Badges / Account Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <VerifiedBadge isVerified={profile.is2FAVerified} />
              {profile.role === 'admin' && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    backgroundColor: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    color: 'var(--accent-gold)',
                    fontSize: '0.78rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                  }}
                >
                  <Crown size={13} />
                  運営管理者
                </span>
              )}
            </div>
          </div>

          <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
            {onLogout ? (
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                style={{ color: '#fc8181' }}
              >
                ログアウト
              </button>
            ) : <div />}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="secondary-button" onClick={onClose}>
                キャンセル
              </button>
              <button type="submit" className="primary-button">
                <Check size={16} />
                保存する
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
