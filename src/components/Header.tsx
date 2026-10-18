import React from 'react';
import { Wind, Bell, Settings, LogIn, LogOut, Crown } from 'lucide-react';
import { UserProfile } from '../types';
import { VerifiedBadge } from './VerifiedBadge';

interface HeaderProps {
  userProfile: UserProfile | null;
  onOpenNoticeModal: () => void;
  onOpenProfileModal: () => void;
  onOpenAdminModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  onOpenNoticeModal,
  onOpenProfileModal,
  onOpenAdminModal,
  onOpenSettingsModal,
  onOpenAuthModal,
  onLogout,
  onGoHome,
}) => {
  return (
    <header className="app-header">
      <div className="header-brand" onClick={onGoHome}>
        <Wind className="brand-icon" size={26} />
        <h1 className="brand-title">風標</h1>
        <span className="brand-tagline">かぜしるべ</span>
      </div>

      {/* Header Right Actions */}
      <div className="header-actions">
        <button
          type="button"
          className="icon-button"
          onClick={onOpenNoticeModal}
          title="お知らせ"
          aria-label="お知らせ"
        >
          <Bell size={20} />
        </button>

        {userProfile ? (
          <>
            {userProfile.role === 'admin' && (
              <button
                type="button"
                className="secondary-button"
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: 'var(--accent-gold)' }}
                onClick={onOpenAdminModal}
                title="運営管理パネル"
              >
                <Crown size={16} />
                <span>管理パネル</span>
              </button>
            )}

            <button
              type="button"
              className="icon-button avatar-text-button"
              onClick={onOpenProfileModal}
              title="マイページ"
              aria-label="マイページ"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="avatar-char-badge">{userProfile.avatar || '風'}</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{userProfile.name}</span>
                <VerifiedBadge isVerified={userProfile.is2FAVerified} />
              </div>
            </button>

            <button
              type="button"
              className="icon-button"
              onClick={onOpenSettingsModal}
              title="環境設定"
              aria-label="環境設定"
            >
              <Settings size={20} />
            </button>

            <button
              type="button"
              className="icon-button auth-header-btn"
              onClick={onLogout}
              title="ログアウト"
              aria-label="ログアウト"
            >
              <LogOut size={18} />
              <span className="auth-btn-label">ログアウト</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            className="icon-button auth-header-btn"
            onClick={onOpenAuthModal}
            title="ログイン・アカウント登録"
          >
            <LogIn size={18} />
            <span className="auth-btn-label">ログイン</span>
          </button>
        )}
      </div>
    </header>
  );
};
