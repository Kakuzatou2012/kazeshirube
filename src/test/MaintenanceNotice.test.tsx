import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MaintenanceScreen } from '../components/MaintenanceScreen';
import { NoticeModal } from '../components/NoticeModal';
import { INITIAL_NOTICES } from '../data/initialData';

describe('メンテナンス画面とお知らせモーダルのテスト', () => {
  it('メンテナンス画面が日本語で正しく描画される', () => {
    const handleToggle = vi.fn();
    const handleOpenModal = vi.fn();

    render(
      <MaintenanceScreen
        notices={INITIAL_NOTICES}
        onToggleMaintenance={handleToggle}
        onOpenNoticeModal={handleOpenModal}
      />
    );

    expect(screen.getByText('ただいま風の整備中です')).toBeInTheDocument();
    expect(screen.getByText('整備中案内')).toBeInTheDocument();
    expect(screen.getByText('通常公開に切り替える 管理者用')).toBeInTheDocument();
  });

  it('管理者トグルをクリックするとコールバックが呼ばれる', () => {
    const handleToggle = vi.fn();
    const handleOpenModal = vi.fn();

    render(
      <MaintenanceScreen
        notices={INITIAL_NOTICES}
        onToggleMaintenance={handleToggle}
        onOpenNoticeModal={handleOpenModal}
      />
    );

    fireEvent.click(screen.getByText('通常公開に切り替える 管理者用'));
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('お知らせモーダルが開いているとき、新着お知らせが表示される', () => {
    const handleClose = vi.fn();

    render(
      <NoticeModal
        isOpen={true}
        onClose={handleClose}
        notices={INITIAL_NOTICES}
      />
    );

    expect(screen.getByText('お知らせ 新着情報')).toBeInTheDocument();
    expect(screen.getByText('言葉の佇まいに関する大切なお願い')).toBeInTheDocument();
  });
});
