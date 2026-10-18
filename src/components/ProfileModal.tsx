import { useState } from 'react';
import { UserProfile } from '../types';
import { User, X, Check } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
}

const AVATAR_PRESETS = ['風', '月', '雨', '雲', '雪', '花', '竹', '鳥', '光', '影', '旅', '道'];

export const ProfileModal = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}: ProfileModalProps) => {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      name: name.trim() || '無名の旅人',
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
            <h2>プロフィール設定</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="閉じる">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">意匠 印字の選択</label>
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

            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">
                お名前
              </label>
              <input
                id="profile-name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-bio">
                自己紹介文
              </label>
              <textarea
                id="profile-bio"
                className="form-textarea"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={150}
                rows={3}
                placeholder="あなたに関する言葉を添えてください…"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-button" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="primary-button">
              <Check size={16} />
              設定を保存する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
