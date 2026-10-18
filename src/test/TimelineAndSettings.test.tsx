import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TimelineView } from '../components/TimelineView';
import { ProfileModal } from '../components/ProfileModal';
import { SettingsModal } from '../components/SettingsModal';
import { INITIAL_USER_PROFILE, INITIAL_TIMELINE_POSTS, INITIAL_USER_SETTINGS } from '../data/initialData';

describe('タイムラインおよび各種設定モーダルのテスト', () => {
  it('タイムラインが正しく表示される', () => {
    render(
      <TimelineView
        posts={INITIAL_TIMELINE_POSTS}
        userProfile={INITIAL_USER_PROFILE}
        onAddPost={vi.fn()}
        onToggleLike={vi.fn()}
        onToggleBookmark={vi.fn()}
        onAddReply={vi.fn()}
        onReportPost={vi.fn()}
      />
    );

    expect(screen.getByText('全体タイムライン')).toBeInTheDocument();
    expect(screen.getByText('古都の閑寂')).toBeInTheDocument();
  });

  it('新規投稿の送信が機能する', () => {
    const handleAdd = vi.fn();

    render(
      <TimelineView
        posts={INITIAL_TIMELINE_POSTS}
        userProfile={INITIAL_USER_PROFILE}
        onAddPost={handleAdd}
        onToggleLike={vi.fn()}
        onToggleBookmark={vi.fn()}
        onAddReply={vi.fn()}
        onReportPost={vi.fn()}
      />
    );

    const textarea = screen.getByPlaceholderText(/伝えたい言葉や出来事を認めてください/);
    fireEvent.change(textarea, { target: { value: '新しい呟きです。' } });
    fireEvent.click(screen.getByRole('button', { name: '投稿する' }));

    expect(handleAdd).toHaveBeenCalledWith('新しい呟きです。', []);
  });

  it('プロフィール変更（マイページ）が保存される', () => {
    const handleSave = vi.fn();

    render(
      <ProfileModal
        isOpen={true}
        onClose={vi.fn()}
        profile={INITIAL_USER_PROFILE}
        onSaveProfile={handleSave}
      />
    );

    const nameInput = screen.getByLabelText('表示名 (名前)');
    fireEvent.change(nameInput, { target: { value: '新名前' } });
    fireEvent.click(screen.getByText('保存する'));

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: '新名前' })
    );
  });

  it('設定モーダルでテーマ変更やアカウントデータ削除が呼ばれる', () => {
    const handleUpdate = vi.fn();
    const handleDelete = vi.fn();

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={INITIAL_USER_SETTINGS}
        onUpdateSettings={handleUpdate}
        onDeleteAccountData={handleDelete}
      />
    );

    fireEvent.click(screen.getByText('アカウントデータを削除する'));
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });
});
