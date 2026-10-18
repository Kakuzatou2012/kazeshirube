import { useState } from 'react';
import { Post, UserProfile } from '../types';
import { Send, Heart, MessageSquare, Info, Sparkles } from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';

interface TimelineViewProps {
  posts: Post[];
  userProfile: UserProfile;
  onAddPost: (content: string) => void;
  onToggleLike: (postId: string) => void;
}

export const TimelineView = ({
  posts,
  userProfile,
  onAddPost,
  onToggleLike,
}: TimelineViewProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAddPost(content.trim());
    setContent('');
  };

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return 'たった今';
    if (minutes < 60) return `${minutes}分前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}時間前`;
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="timeline-container">
      {/* Language Guideline Banner */}
      <div className="language-banner">
        <Info size={18} className="language-banner-icon" />
        <span>当コミュニティは、日本語での温かく丁寧な対話を前提としております。</span>
      </div>

      {/* Post Creation Box */}
      <div className="post-create-card">
        <div className="post-create-header">
          <span className="user-avatar-badge">{userProfile.avatar || '風'}</span>
          <span className="post-create-user-name">{userProfile.name}</span>
          <VerifiedBadge isVerified={userProfile.is2FAVerified} />
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            className="post-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="風に乗せる言葉を認めてください…"
            maxLength={300}
            rows={3}
          />
          <div className="post-create-footer">
            <span className="character-count">{content.length} / 300文字</span>
            <button
              type="submit"
              className="primary-button"
              disabled={!content.trim()}
            >
              <Send size={16} />
              風に乗せる
            </button>
          </div>
        </form>
      </div>

      {/* Timeline Header */}
      <div className="timeline-header-bar">
        <MessageSquare size={18} />
        <h2>全体タイムライン 風の呟き</h2>
        <span className="timeline-count">{posts.length} 件の言葉</span>
      </div>

      {/* Posts List */}
      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="empty-posts-state">
            <Sparkles size={32} className="empty-icon" />
            <p>まだ風に乗せられた言葉はありません。</p>
            <p className="empty-subtext">最初にひとことを投稿してみましょう。</p>
          </div>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="post-card">
              <div className="post-avatar">{post.authorAvatar || '風'}</div>
              <div className="post-content-area">
                <div className="post-meta">
                  <span className="post-author-name">{post.authorName}</span>
                  <VerifiedBadge isVerified={post.authorIs2FAVerified} />
                  <span className="post-timestamp">{formatTimestamp(post.createdAt)}</span>
                </div>
                <p className="post-body">{post.content}</p>
                <div className="post-actions">
                  <button
                    className={`like-button ${post.likedByMe ? 'liked' : ''}`}
                    onClick={() => onToggleLike(post.id)}
                    aria-label="心根を送る"
                  >
                    <Heart size={16} fill={post.likedByMe ? 'currentColor' : 'none'} />
                    <span>{post.likes}</span>
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
