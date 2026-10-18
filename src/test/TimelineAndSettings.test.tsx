import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TimelineView } from '../components/TimelineView';
import { ProfileModal } from '../components/ProfileModal';
import { SettingsModal } from '../components/SettingsModal';
import { INITIAL_USER_PROFILE, INITIAL_TIMELINE_POSTS, INITIAL_USER_SETTINGS } from '../data/initialData';

describe('タイムラインおよび各種設定モーダルのテスト', () => {
  it('タイムラインが正しく表示され、言語案内が表示される', () => {
    const handleAdd = vi.fn();
    const handleLike = vi.fn();

    render(
      <TimelineView
        posts={INITIAL_TIMELINE_POSTS}
        userProfile={INITIAL_USER_PROFILE}
        onAddPost={handleAdd}
        onToggleLike={handleLike}
      />
    );

    expect(screen.getByText('当コミュニティは、日本語での温かく丁寧な対話を前提としております。')).toBeInTheDocument();
    expect(screen.getByText('古都の閑寂')).toBeInTheDocument();
  });

  it('新規投稿の入力と送信が機能する', () => {
    const handleAdd = vi.fn();
    const handleLike = vi.fn();

    render(
      <TimelineView
        posts={INITIAL_TIMELINE_POSTS}
        userProfile={INITIAL_USER_PROFILE}
        onAddPost={handleAdd}
        onToggleLike={handleLike}
      />
    );

    const textarea = screen.getByPlaceholderText('風に乗せる言葉を認めてください…');
    fireEvent.change(textarea, { target: { value: '新しいテストの呟きです。' } });
    fireEvent.click(screen.getByText('風に乗せる'));

    expect(handleAdd).toHaveBeenCalledWith('新しいテストの呟きです。');
  });

  it('プロフィール変更が保存される', () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    render(
      <ProfileModal
        isOpen={true}
        onClose={handleClose}
        profile={INITIAL_USER_PROFILE}
        onSaveProfile={handleSave}
      />
    );

    const nameInput = screen.getByLabelText('お名前');
    fireEvent.change(nameInput, { target: { value: '新しい名前' } });
    fireEvent.click(screen.getByText('設定を保存する'));

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: '新しい名前' })
    );
  });

  it('設定モーダルでフォントサイズ変更やデータの初期化が呼ばれる', () => {
    const handleUpdate = vi.fn();
    const handleReset = vi.fn();
    const handleClose = vi.fn();

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <SettingsModal
        isOpen={true}
        onClose={handleClose}
        settings={INITIAL_USER_SETTINGS}
        onUpdateSettings={handleUpdate}
        onResetData={handleReset}
      />
    );

    fireEvent.click(screen.getByText('全データを初期化する'));
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
