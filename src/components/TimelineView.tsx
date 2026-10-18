import React, { useState, useCallback } from 'react';
import { Post, UserProfile } from '../types';
import { Send, Heart, MessageSquare, Bookmark, ShieldAlert, Image as ImageIcon, X, CornerDownRight } from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import { formatTimestamp } from '../utils/formatTimestamp';

interface TimelineViewProps {
  posts: Post[];
  userProfile: UserProfile;
  onAddPost: (content: string, images?: string[]) => void;
  onToggleLike: (postId: string) => void;
  onToggleBookmark: (postId: string) => void;
  onAddReply: (postId: string, content: string, images?: string[]) => void;
  onReportPost: (postId: string, postContent: string, authorId: string, authorName: string, reason: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = React.memo(({
  posts,
  userProfile,
  onAddPost,
  onToggleLike,
  onToggleBookmark,
  onAddReply,
  onReportPost,
}) => {
  const [content, setContent] = useState('');
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [openReplyThreadId, setOpenReplyThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [reportModalPost, setReportModalPost] = useState<Post | null>(null);
  const [reportReason, setReportReason] = useState('不適切な内容が含まれています');

  // Handle Image Upload Selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 2 * 1024 * 1024) {
      alert('画像サイズは2MB以下で選択してください。');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result && typeof reader.result === 'string') {
        setAttachedImages((prev) => [...prev, reader.result as string]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setAttachedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && attachedImages.length === 0) return;
    onAddPost(content.trim(), attachedImages);
    setContent('');
    setAttachedImages([]);
  };

  const handleSendReply = useCallback((postId: string) => {
    if (!replyText.trim()) return;
    onAddReply(postId, replyText.trim());
    setReplyText('');
  }, [replyText, onAddReply]);

  const handleConfirmReport = () => {
    if (!reportModalPost) return;
    onReportPost(
      reportModalPost.id,
      reportModalPost.content,
      reportModalPost.authorId,
      reportModalPost.authorName,
      reportReason
    );
    alert('通報を送信いたしました。運営にて内容を確認いたします。');
    setReportModalPost(null);
  };

  const renderTextWithMentions = (text: string) => {
    const parts = text.split(/(@[a-zA-Z0-9_]+)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('@')) {
        return (
          <span key={idx} style={{ color: 'var(--accent-teal)', fontWeight: 600 }}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="timeline-container">
      {/* Post Creation Card */}
      <div className="post-create-card">
        <div className="post-create-header">
          <span className="user-avatar-badge">{userProfile.avatar || '風'}</span>
          <span className="post-create-user-name">{userProfile.name}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{userProfile.id}</span>
          <VerifiedBadge isVerified={userProfile.is2FAVerified} />
        </div>

        <form onSubmit={handleSubmitPost}>
          <textarea
            className="post-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="伝えたい言葉や出来事を認めてください…"
            maxLength={300}
            rows={3}
          />

          {/* Attached Image Previews */}
          {attachedImages.length > 0 && (
            <div className="image-preview-container">
              {attachedImages.map((imgUrl, i) => (
                <div key={i} className="image-preview-item">
                  <img src={imgUrl} alt="添付画像" />
                  <button
                    type="button"
                    className="image-preview-remove"
                    onClick={() => handleRemoveImage(i)}
                    aria-label="画像を削除"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="post-create-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label className="secondary-button" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                <ImageIcon size={15} />
                画像選択
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
              </label>
              <span className="character-count">{content.length} / 300文字</span>
            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={!content.trim() && attachedImages.length === 0}
            >
              <Send size={16} />
              投稿する
            </button>
          </div>
        </form>
      </div>

      {/* Timeline Header */}
      <div className="timeline-header-bar">
        <MessageSquare size={18} />
        <h2>全体タイムライン</h2>
        <span className="timeline-count">{posts.length} 件の投稿</span>
      </div>

      {/* Posts List */}
      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="empty-posts-state">
            <p>まだ投稿はありません。</p>
            <p className="empty-subtext">最初のメッセージを投稿してみましょう。</p>
          </div>
        ) : (
          posts.map((post) => {
            const isReplying = openReplyThreadId === post.id;
            const replyList = post.replies || [];

            return (
              <article key={post.id} className="post-card">
                <div className="post-avatar">{post.authorAvatar || '風'}</div>
                <div className="post-content-area">
                  <div className="post-meta">
                    <span className="post-author-name">{post.authorName}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>@{post.authorId}</span>
                    <VerifiedBadge isVerified={post.authorIs2FAVerified} />
                    <span className="post-timestamp">{formatTimestamp(post.createdAt)}</span>
                  </div>

                  <p className="post-body">{renderTextWithMentions(post.content)}</p>

                  {/* Attached Images */}
                  {post.images && post.images.length > 0 && (
                    <div className="attached-images-grid">
                      {post.images.map((imgSrc, idx) => (
                        <div key={idx} className="attached-image-card">
                          <img src={imgSrc} alt="投稿添付画像" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Post Actions: Like, Reply, Bookmark, Report */}
                  <div className="post-actions">
                    <button
                      className={`action-btn like-button ${post.likedByMe ? 'liked' : ''}`}
                      onClick={() => onToggleLike(post.id)}
                      aria-label="いいね"
                    >
                      <Heart size={15} fill={post.likedByMe ? 'currentColor' : 'none'} />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      className={`action-btn ${isReplying ? 'active' : ''}`}
                      onClick={() => setOpenReplyThreadId(isReplying ? null : post.id)}
                    >
                      <MessageSquare size={15} />
                      <span>返信 ({replyList.length})</span>
                    </button>

                    <button
                      className={`action-btn ${post.bookmarkedByMe ? 'active' : ''}`}
                      onClick={() => onToggleBookmark(post.id)}
                      title="ブックマーク"
                    >
                      <Bookmark size={15} fill={post.bookmarkedByMe ? 'currentColor' : 'none'} />
                      <span>{post.bookmarkedByMe ? '保存済み' : '保存'}</span>
                    </button>

                    <button
                      className="action-btn"
                      onClick={() => setReportModalPost(post)}
                      title="通報"
                      style={{ marginLeft: 'auto' }}
                    >
                      <ShieldAlert size={15} />
                      <span>通報</span>
                    </button>
                  </div>

                  {/* Reply Thread Section */}
                  {isReplying && (
                    <div className="thread-replies-box">
                      {replyList.map((rep) => (
                        <div key={rep.id} className="reply-item">
                          <div className="reply-avatar">{rep.authorAvatar || '風'}</div>
                          <div className="reply-content-area">
                            <div className="reply-meta">
                              <span className="reply-author">{rep.authorName}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{rep.authorId}</span>
                              <VerifiedBadge isVerified={rep.authorIs2FAVerified} />
                              <span className="reply-time">{formatTimestamp(rep.createdAt)}</span>
                            </div>
                            <p className="reply-body">{renderTextWithMentions(rep.content)}</p>
                          </div>
                        </div>
                      ))}

                      {/* Reply Input Form */}
                      <div className="reply-input-box">
                        <CornerDownRight size={16} style={{ color: 'var(--text-muted)', marginTop: '0.6rem' }} />
                        <input
                          type="text"
                          className="form-input"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`@${post.authorId} 様へ返信を入力…`}
                          maxLength={200}
                        />
                        <button
                          type="button"
                          className="primary-button"
                          style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                          onClick={() => handleSendReply(post.id)}
                          disabled={!replyText.trim()}
                        >
                          返信する
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Report Modal */}
      {reportModalPost && (
        <div className="modal-overlay" onClick={() => setReportModalPost(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <ShieldAlert size={20} className="modal-title-icon" style={{ color: '#fc8181' }} />
                <h2>投稿の通報</h2>
              </div>
              <button className="icon-button" onClick={() => setReportModalPost(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                対象投稿: 「{reportModalPost.content}」
              </p>
              <div className="form-group">
                <label className="form-label">通報理由を選択してください</label>
                <select
                  className="form-select"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                >
                  <option value="不適切な内容が含まれています">不適切な内容が含まれています</option>
                  <option value="誹謗中傷・ハラスメント">誹謗中傷・ハラスメント</option>
                  <option value="スパム・宣伝行為">スパム・宣伝行為</option>
                  <option value="その他">その他</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="secondary-button" onClick={() => setReportModalPost(null)}>
                キャンセル
              </button>
              <button className="danger-button" style={{ marginTop: 0 }} onClick={handleConfirmReport}>
                通報を送信する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
