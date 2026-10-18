import React, { useState } from 'react';
import { AuthAccount, Notice, ReportItem } from '../types';
import { Crown, X, ShieldAlert, Bell, UserX, UserCheck, Plus, Trash2, Edit3, CheckCircle } from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: AuthAccount[];
  notices: Notice[];
  reports: ReportItem[];
  onToggleFreezeUser: (userId: string) => void;
  onAddNotice: (notice: Notice) => void;
  onEditNotice: (notice: Notice) => void;
  onDeleteNotice: (noticeId: string) => void;
  onResolveReport: (reportId: string) => void;
  onDeleteReportedContent: (report: ReportItem) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  accounts,
  notices,
  reports,
  onToggleFreezeUser,
  onAddNotice,
  onEditNotice,
  onDeleteNotice,
  onResolveReport,
  onDeleteReportedContent,
}) => {
  const [tab, setTab] = useState<'users' | 'reports' | 'notices'>('reports');

  // Notice form states
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'整備' | '更新' | '案内'>('案内');
  const [noticeImportant, setNoticeImportant] = useState(false);

  if (!isOpen) return null;

  const handleStartNoticeEdit = (notice: Notice) => {
    setEditingNoticeId(notice.id);
    setNoticeTitle(notice.title);
    setNoticeContent(notice.content);
    setNoticeCategory(notice.category);
    setNoticeImportant(!!notice.important);
  };

  const handleResetNoticeForm = () => {
    setEditingNoticeId(null);
    setNoticeTitle('');
    setNoticeContent('');
    setNoticeCategory('案内');
    setNoticeImportant(false);
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    if (editingNoticeId) {
      onEditNotice({
        id: editingNoticeId,
        title: noticeTitle.trim(),
        content: noticeContent.trim(),
        category: noticeCategory,
        important: noticeImportant,
        createdAt: Date.now(),
      });
    } else {
      onAddNotice({
        id: `notice-${Date.now()}`,
        title: noticeTitle.trim(),
        content: noticeContent.trim(),
        category: noticeCategory,
        important: noticeImportant,
        createdAt: Date.now(),
      });
    }

    handleResetNoticeForm();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <Crown size={20} className="modal-title-icon" style={{ color: 'var(--accent-gold)' }} />
            <h2>運営管理パネル (@kakuzatou 専用)</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="閉じる">
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="auth-tab-bar">
          <button
            type="button"
            className={`auth-tab-btn ${tab === 'reports' ? 'active' : ''}`}
            onClick={() => setTab('reports')}
          >
            <ShieldAlert size={15} /> 通報一覧 ({reports.filter((r) => r.status === 'pending').length})
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${tab === 'users' ? 'active' : ''}`}
            onClick={() => setTab('users')}
          >
            <UserX size={15} /> アカウント管理
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${tab === 'notices' ? 'active' : ''}`}
            onClick={() => setTab('notices')}
          >
            <Bell size={15} /> お知らせ管理
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {/* Reports Management */}
          {tab === 'reports' && (
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>通報内容の確認一覧</h3>
              {reports.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                  現在未処理の通報はありません。
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reports.map((r) => (
                    <div
                      key={r.id}
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '1rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-teal)' }}>
                          種別: {r.targetType === 'post' ? '投稿' : r.targetType === 'chat_message' ? 'チャット' : 'DM'}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: r.status === 'pending' ? '#fc8181' : 'var(--text-muted)' }}>
                          {r.status === 'pending' ? '未対応' : '対応済み'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                        対象内容: 「{r.targetContent}」
                      </p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        通報理由: {r.reason} (通報者: {r.reporterName} @{r.reporterId})
                      </p>
                      {r.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                          <button
                            type="button"
                            className="danger-button"
                            style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                            onClick={() => onDeleteReportedContent(r)}
                          >
                            <Trash2 size={14} /> 対象コンテンツを削除
                          </button>
                          <button
                            type="button"
                            className="secondary-button"
                            style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                            onClick={() => onResolveReport(r.id)}
                          >
                            <CheckCircle size={14} /> 解決済みにする
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* User Freeze Management */}
          {tab === 'users' && (
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>ユーザーの凍結・凍結解除</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: 600 }}>{acc.name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{acc.id}</span>
                        {acc.role === 'admin' && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)' }}>(運営)</span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{acc.email}</span>
                    </div>

                    {acc.id !== 'kakuzatou' && (
                      <button
                        type="button"
                        className={acc.isFrozen ? 'secondary-button' : 'danger-button'}
                        style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                        onClick={() => onToggleFreezeUser(acc.id)}
                      >
                        {acc.isFrozen ? (
                          <>
                            <UserCheck size={14} /> 凍結解除
                          </>
                        ) : (
                          <>
                            <UserX size={14} /> アカウント凍結
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notices Management */}
          {tab === 'notices' && (
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
                {editingNoticeId ? 'お知らせの編集' : '新しいお知らせの作成'}
              </h3>
              <form onSubmit={handleSaveNotice} style={{ marginBottom: '1.5rem', backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
                <div className="form-group">
                  <label className="form-label">件名・タイトル</label>
                  <input
                    type="text"
                    className="form-input"
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">本文</label>
                  <textarea
                    className="form-textarea"
                    value={noticeContent}
                    onChange={(e) => setNoticeContent(e.target.value)}
                    rows={3}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <select
                    className="form-select"
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value as any)}
                  >
                    <option value="案内">案内</option>
                    <option value="整備">整備</option>
                    <option value="更新">更新</option>
                  </select>
                  <label style={{ fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={noticeImportant}
                      onChange={(e) => setNoticeImportant(e.target.checked)}
                    />
                    重要なお知らせ
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" className="primary-button" style={{ fontSize: '0.85rem' }}>
                    <Plus size={15} /> {editingNoticeId ? '更新する' : '作成・公開する'}
                  </button>
                  {editingNoticeId && (
                    <button type="button" className="secondary-button" onClick={handleResetNoticeForm} style={{ fontSize: '0.85rem' }}>
                      キャンセル
                    </button>
                  )}
                </div>
              </form>

              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>公開中のお知らせ一覧</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {notices.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', marginRight: '0.5rem' }}>[{n.category}]</span>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{n.title}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className="secondary-button"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem' }}
                        onClick={() => handleStartNoticeEdit(n)}
                      >
                        <Edit3 size={13} /> 編集
                      </button>
                      <button
                        type="button"
                        className="danger-button"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem' }}
                        onClick={() => onDeleteNotice(n.id)}
                      >
                        <Trash2 size={13} /> 削除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
