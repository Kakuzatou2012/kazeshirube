import { Notice } from '../types';
import { Wind, Wrench, Bell, Unlock } from 'lucide-react';

interface MaintenanceScreenProps {
  notices: Notice[];
  onToggleMaintenance: () => void;
  onOpenNoticeModal: () => void;
}

export const MaintenanceScreen = ({
  notices,
  onToggleMaintenance,
  onOpenNoticeModal,
}: MaintenanceScreenProps) => {
  const latestNotice = notices[0];

  return (
    <div className="maintenance-container">
      <div className="maintenance-card">
        <div className="maintenance-icon-wrapper">
          <Wind className="maintenance-wind-icon floating-anim" size={48} />
          <Wrench className="maintenance-wrench-icon" size={24} />
        </div>

        <h1 className="maintenance-title">ただいま風の整備中です</h1>
        <p className="maintenance-subtitle">整備中案内</p>

        <p className="maintenance-description">
          静かな世界をより心地よくお過ごしいただけるよう、ただいま風の通り道を整えております。
          整備期間中はタイムラインおよび対話機能の提供を一時的にお休みしております。
          ご不便をおかけいたしますが、風が静まるまで今しばらくお待ちくださいませ。
        </p>

        {latestNotice && (
          <div className="maintenance-notice-box" onClick={onOpenNoticeModal}>
            <div className="maintenance-notice-header">
              <Bell size={16} />
              <span>最新のお知らせ {latestNotice.date}</span>
            </div>
            <p className="maintenance-notice-title">{latestNotice.title}</p>
            <span className="maintenance-notice-link">一覧を見る →</span>
          </div>
        )}

        <div className="maintenance-actions">
          <button className="secondary-button" onClick={onOpenNoticeModal}>
            <Bell size={16} />
            お知らせ一覧を確認する
          </button>

          <button className="toggle-maintenance-button" onClick={onToggleMaintenance}>
            <Unlock size={16} />
            通常公開に切り替える 管理者用
          </button>
        </div>

        <footer className="maintenance-footer">
          <p>完全無料コミュニティサイト 風標</p>
          <p className="language-guidelines-text">※ 当コミュニティは日本語での対話を前提としております。</p>
        </footer>
      </div>
    </div>
  );
};
