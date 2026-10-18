import React from 'react';
import { UserSettings, ThemeMode } from '../types';
import { Settings, X, Volume2, VolumeX, Trash2, Moon, Sun } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onDeleteAccountData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onDeleteAccountData,
}) => {
  if (!isOpen) return null;

  const handleToggleSound = () => {
    onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  const handleThemeChange = (mode: ThemeMode) => {
    onUpdateSettings({ ...settings, theme: mode });
  };

  const handleDeleteAccount = () => {
    if (window.confirm('アカウントデータおよび保存データをすべて削除しますか？この操作は取り消せません。')) {
      onDeleteAccountData();
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <Settings size={20} className="modal-title-icon" />
            <h2>環境設定</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="閉じる">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Theme Settings */}
          <div className="settings-section">
            <h3 className="settings-section-title">
              {settings.theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />} テーマ設定
            </h3>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">表示テーマ</span>
                <span className="setting-desc">ダークモードとライトモードの切り替え</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className={`choice-btn ${settings.theme === 'dark' ? 'selected' : ''}`}
                  onClick={() => handleThemeChange('dark')}
                >
                  <Moon size={14} /> ダーク
                </button>
                <button
                  type="button"
                  className={`choice-btn ${settings.theme === 'light' ? 'selected' : ''}`}
                  onClick={() => handleThemeChange('light')}
                >
                  <Sun size={14} /> ライト
                </button>
              </div>
            </div>
          </div>

          {/* Sound Settings */}
          <div className="settings-section">
            <h3 className="settings-section-title">効果音設定</h3>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">効果音の再生</span>
                <span className="setting-desc">新着メッセージや通知時の効果音</span>
              </div>
              <button
                type="button"
                className={`toggle-switch ${settings.soundEnabled ? 'active' : ''}`}
                onClick={handleToggleSound}
              >
                {settings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span>{settings.soundEnabled ? '有効' : '無効'}</span>
              </button>
            </div>
          </div>

          {/* Delete Account Data */}
          <div className="settings-section danger-zone">
            <h3 className="settings-section-title danger-text">
              <Trash2 size={16} /> アカウントデータ削除
            </h3>
            <p className="setting-desc">
              アカウントデータおよびブラウザ内に保存されたデータを完全に消去します。
            </p>
            <button
              type="button"
              className="danger-button"
              onClick={handleDeleteAccount}
            >
              <Trash2 size={16} />
              アカウントデータを削除する
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="primary-button" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
