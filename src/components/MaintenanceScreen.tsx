import React from 'react';
import { Notice } from '../types';
import { Wind, Wrench, Bell, Unlock } from 'lucide-react';
import { formatTimestamp } from '../utils/formatTimestamp';

interface MaintenanceScreenProps {
  notices: Notice[];
  onToggleMaintenance: () => void;
  onOpenNoticeModal: () => void;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({
  notices,
  onToggleMaintenance,
  onOpenNoticeModal,
}) => {
  const latestNotice = notices[0];

  return (
    <div className="maintenance-container">
      <div className="maintenance-card">
        <div className="maintenance-icon-wrapper">
          <Wind className="maintenance-wind-icon floating-anim" size={48} />
          <Wrench className="maintenance-wrench-icon" size={24} />
        </div>

        <h1 className="maintenance-title">ただいまメンテナンス中です</h1>
        <p className="maintenance-subtitle">システム整備案内</p>

        <p className="maintenance-description">
          サービス改善のためシステム整備を実施しております。
          メンテナンス期間中は機能の提供を一時的にお休みしております。
          完了まで今しばらくお待ちください。
        </p>

        {latestNotice && (
          <div className="maintenance-notice-box" onClick={onOpenNoticeModal}>
            <div className="maintenance-notice-header">
              <Bell size={16} />
              <span>最新のお知らせ {formatTimestamp(latestNotice.createdAt)}</span>
            </div>
            <p className="maintenance-notice-title">{latestNotice.title}</p>
            <span className="maintenance-notice-link">一覧を見る</span>
          </div>
        )}

        <div className="maintenance-actions">
          <button className="secondary-button" onClick={onOpenNoticeModal}>
            <Bell size={16} />
            お知らせ一覧を確認する
          </button>

          <button className="toggle-maintenance-button" onClick={onToggleMaintenance}>
            <Unlock size={16} />
            通常公開に切り替える (管理者用)
          </button>
        </div>

        <footer className="maintenance-footer">
          <p>コミュニティサイト 風標</p>
        </footer>
      </div>
    </div>
  );
};
