import { UserSettings, FontSizeOption } from '../types';
import { Settings, X, Volume2, VolumeX, Bell, Type, RefreshCw, AlertTriangle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onResetData: () => void;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetData,
}: SettingsModalProps) => {
  if (!isOpen) return null;

  const handleToggleSound = () => {
    onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  const handleToggleDesktopNotifications = async () => {
    if (!settings.desktopNotifications && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        onUpdateSettings({ ...settings, desktopNotifications: true });
      } else {
        alert('ブラウザの通知許可が得られませんでした。');
      }
    } else {
      onUpdateSettings({ ...settings, desktopNotifications: false });
    }
  };

  const handleChangeFontSize = (size: FontSizeOption) => {
    onUpdateSettings({ ...settings, fontSize: size });
  };

  const handleReset = () => {
    if (window.confirm('これまでの設定やローカルデータを初期状態に戻しますか？')) {
      onResetData();
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
          {/* Notification Settings */}
          <div className="settings-section">
            <h3 className="settings-section-title">
              <Bell size={16} /> 通知設定
            </h3>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">効果音の再生</span>
                <span className="setting-desc">マッチングや新着メッセージ受信時の効果音</span>
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

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">デスクトップ通知</span>
                <span className="setting-desc">バックグラウンド時の新着通知</span>
              </div>
              <button
                type="button"
                className={`toggle-switch ${settings.desktopNotifications ? 'active' : ''}`}
                onClick={handleToggleDesktopNotifications}
              >
                <span>{settings.desktopNotifications ? '有効' : '無効'}</span>
              </button>
            </div>
          </div>

          {/* Typography Settings */}
          <div className="settings-section">
            <h3 className="settings-section-title">
              <Type size={16} /> 表示設定
            </h3>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">文字の大きさ</span>
                <span className="setting-desc">画面全体の明朝体のサイズ調整</span>
              </div>
              <div className="font-size-options">
                {(['sm', 'md', 'lg'] as FontSizeOption[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`font-size-btn ${settings.fontSize === size ? 'selected' : ''}`}
                    onClick={() => handleChangeFontSize(size)}
                  >
                    {size === 'sm' ? '小' : size === 'md' ? '標準' : '大'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Account/Data Reset */}
          <div className="settings-section danger-zone">
            <h3 className="settings-section-title danger-text">
              <AlertTriangle size={16} /> アカウントデータ初期化
            </h3>
            <p className="setting-desc">
              ローカルストレージやセッションに保存されたデータを消去し、初期状態にリセットします。
            </p>
            <button
              type="button"
              className="danger-button"
              onClick={handleReset}
            >
              <RefreshCw size={16} />
              全データを初期化する
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
