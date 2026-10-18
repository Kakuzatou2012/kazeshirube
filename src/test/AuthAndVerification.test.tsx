import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthModal } from '../components/AuthModal';
import { VerifiedBadge } from '../components/VerifiedBadge';
import { INITIAL_USER_PROFILE } from '../data/initialData';
import { AuthAccount } from '../types';

describe('認証モーダルと2段階認証マーク・所有権確認ファイルのテスト', () => {
  it('2段階認証マークが正しく描画される', () => {
    const { rerender } = render(<VerifiedBadge isVerified={true} />);
    expect(screen.getByTitle('2段階認証済')).toBeInTheDocument();
    expect(screen.getByText('認証済')).toBeInTheDocument();

    rerender(<VerifiedBadge isVerified={false} />);
    expect(screen.queryByText('認証済')).not.toBeInTheDocument();
  });

  it('アカウント登録とログインが機能する', () => {
    const handleLogin = vi.fn();
    const handleRegister = vi.fn();
    const handleClose = vi.fn();

    const mockAccounts: AuthAccount[] = [
      {
        id: 'acc-1',
        username: 'テスト旅人',
        password: 'password123',
        email: 'test@example.com',
        is2FAVerified: true,
        avatar: '風',
        bio: '自己紹介',
      },
    ];

    render(
      <AuthModal
        isOpen={true}
        onClose={handleClose}
        currentUser={INITIAL_USER_PROFILE}
        accounts={mockAccounts}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onVerify2FA={vi.fn()}
      />
    );

    // Test Login
    const usernameInput = screen.getByLabelText(/ユーザー名/);
    const passwordInput = screen.getByLabelText(/パスワード/);

    fireEvent.change(usernameInput, { target: { value: 'テスト旅人' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /ログインする/ }));

    expect(handleLogin).toHaveBeenCalledWith(mockAccounts[0]);
  });

  it('2段階認証のコード発行と完了処理が実行される', () => {
    const handleVerify2FA = vi.fn();

    render(
      <AuthModal
        isOpen={true}
        onClose={vi.fn()}
        currentUser={INITIAL_USER_PROFILE}
        accounts={[]}
        onLogin={vi.fn()}
        onRegister={vi.fn()}
        onVerify2FA={handleVerify2FA}
      />
    );

    // Switch to 2FA tab
    fireEvent.click(screen.getByRole('button', { name: /2段階認証/ }));

    // Request code
    const emailInput = screen.getByLabelText(/送信先メールアドレス/);
    fireEvent.change(emailInput, { target: { value: 'user@kazeshirube.jp' } });
    fireEvent.click(screen.getByText('コード発行'));

    expect(screen.getByText(/確認コードを発行いたしました/)).toBeInTheDocument();
  });
});
