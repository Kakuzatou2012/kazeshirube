import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import App from '../App';

describe('アプリケーション統合動作テスト', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('初期状態（通常モード）でタイムラインが表示される', () => {
    render(<App />);

    expect(screen.getByText('当コミュニティは、日本語での温かく丁寧な対話を前提としております。')).toBeInTheDocument();
  });

  it('「風に乗せる」マッチングを開始し、チャット画面へ遷移できる', () => {
    render(<App />);

    fireEvent.click(screen.getAllByRole('button', { name: '風に乗せる' })[0]);

    expect(screen.getByText('誰かを待っています…')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText('10分対話部屋')).toBeInTheDocument();
    expect(screen.getAllByText('紅葉の長老')[0]).toBeInTheDocument();
  });
});
