import { Wind, Bell, Settings, Loader2, LogIn } from 'lucide-react';
import { UserProfile } from '../types';
import { VerifiedBadge } from './VerifiedBadge';

interface HeaderProps {
  userProfile: UserProfile;
  isMatchingWaiting: boolean;
  isInChat: boolean;
  onStartMatching: () => void;
  onOpenNoticeModal: () => void;
  onOpenProfileModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenAuthModal: () => void;
  onGoHome: () => void;
}

export const Header = ({
  userProfile,
  isMatchingWaiting,
  isInChat,
  onStartMatching,
  onOpenNoticeModal,
  onOpenProfileModal,
  onOpenSettingsModal,
  onOpenAuthModal,
  onGoHome,
}: HeaderProps) => {
  return (
    <header className="app-header">
      <div className="header-brand" onClick={onGoHome}>
        <Wind className="brand-icon" size={26} />
        <h1 className="brand-title">風標</h1>
        <span className="brand-tagline">かぜしるべ</span>
      </div>

      {/* Header Center Status Indicator */}
      <div className="header-center-status">
        {isMatchingWaiting ? (
          <div className="status-waiting-indicator">
            <div className="status-pulse-dot" />
            <span>誰かを待っています…</span>
          </div>
        ) : isInChat ? (
          <div className="status-waiting-indicator">
            <span className="status-pulse-dot" style={{ backgroundColor: '#5b8def' }} />
            <span>一期一会の対話中…</span>
          </div>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>静かな風が吹いています</span>
        )}
      </div>

      {/* Header Right Actions */}
      <div className="header-actions">
        <button
          className="wind-button"
          onClick={onStartMatching}
          disabled={isMatchingWaiting || isInChat}
          title={
            isInChat
              ? '現在対話中です'
              : isMatchingWaiting
              ? '誰かを待っている最中です…'
              : '一期一会の誰かと出会うため風に乗せます'
          }
        >
          {isMatchingWaiting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>風を待つ中…</span>
            </>
          ) : (
            <>
              <Wind size={16} />
              <span>風に乗せる</span>
            </>
          )}
        </button>

        <button
          className="icon-button"
          onClick={onOpenNoticeModal}
          title="お知らせを見る"
          aria-label="お知らせ"
        >
          <Bell size={20} />
        </button>

        <button
          className="icon-button auth-header-btn"
          onClick={onOpenAuthModal}
          title="ログイン アカウント登録 2段階認証"
        >
          <LogIn size={18} />
          <span className="auth-btn-label">アカウント</span>
        </button>

        <button
          className="icon-button avatar-text-button"
          onClick={onOpenProfileModal}
          title="プロフィール設定"
          aria-label="プロフィール設定"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span className="avatar-char-badge">{userProfile.avatar || '風'}</span>
            <VerifiedBadge isVerified={userProfile.is2FAVerified} />
          </div>
        </button>

        <button
          className="icon-button"
          onClick={onOpenSettingsModal}
          title="環境設定"
          aria-label="環境設定"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};
