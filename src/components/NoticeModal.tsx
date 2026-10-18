import { Notice } from '../types';
import { Bell, X, Info, AlertTriangle, RefreshCw } from 'lucide-react';

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  notices: Notice[];
}

export const NoticeModal = ({ isOpen, onClose, notices }: NoticeModalProps) => {
  if (!isOpen) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '整備':
        return <AlertTriangle size={16} className="notice-icon-warning" />;
      case '更新':
        return <RefreshCw size={16} className="notice-icon-update" />;
      default:
        return <Info size={16} className="notice-icon-info" />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card notice-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <Bell size={20} className="modal-title-icon" />
            <h2>お知らせ 新着情報</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="閉じる">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body notice-modal-body">
          <div className="notice-list">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className={`notice-item ${notice.important ? 'important' : ''}`}
              >
                <div className="notice-item-header">
                  <span className={`notice-badge category-${notice.category}`}>
                    {getCategoryIcon(notice.category)}
                    {notice.category}
                  </span>
                  <span className="notice-date">{notice.date}</span>
                </div>
                <h3 className="notice-item-title">{notice.title}</h3>
                <p className="notice-item-content">{notice.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="primary-button" onClick={onClose}>
            確認いたしました
          </button>
        </div>
      </div>
    </div>
  );
};
