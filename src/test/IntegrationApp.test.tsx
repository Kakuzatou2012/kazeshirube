import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';
import { INITIAL_USER_PROFILE } from '../data/initialData';

describe('アプリケーション統合動作テスト', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('ログイン済み初期状態でタイムラインが表示される', () => {
    localStorage.setItem('kazeshirube_profile', JSON.stringify(INITIAL_USER_PROFILE));
    render(<App />);

    expect(screen.getAllByText('全体タイムライン')[0]).toBeInTheDocument();
    expect(screen.getByText('古都の閑寂')).toBeInTheDocument();
  });

  it('未ログイン状態でログイン画面に制限される（完全強制ログイン化）', () => {
    render(<App />);

    expect(screen.getByText('風標へようこそ')).toBeInTheDocument();
    expect(screen.getByText('サービスをご利用いただくにはログインまたはアカウント登録が必要です。')).toBeInTheDocument();
  });

  it('@kakuzatou アカウントでログインすると管理パネルボタンが表示される', () => {
    const adminProfile = {
      id: 'kakuzatou',
      name: '運営管理者',
      bio: '',
      avatar: '統',
      email: 'kakuzatou@kazeshirube.jp',
      is2FAVerified: true,
      role: 'admin',
    };
    localStorage.setItem('kazeshirube_profile', JSON.stringify(adminProfile));

    render(<App />);

    expect(screen.getByText('管理パネル')).toBeInTheDocument();
  });
});
