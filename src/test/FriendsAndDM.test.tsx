import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FriendsView } from '../components/FriendsView';
import { Friend } from '../types';
import { INITIAL_USER_PROFILE } from '../data/initialData';

const mockFriends: Friend[] = [
  {
    id: 'user_kyoto',
    name: '古都の閑寂',
    avatar: '古',
    bio: '京都の街並みを愛する旅人です。',
    connectedAt: Date.now(),
    messages: [
      {
        id: 'dm-1',
        senderId: 'user_kyoto',
        receiverId: 'user_sakura',
        content: '今後ともよろしくお願いいたします。',
        createdAt: Date.now(),
      },
    ],
  },
];

describe('フレンド・ダイレクトメッセージ (DM) 画面のテスト', () => {
  it('フレンド一覧画面で1対1のダイレクトメッセージを送信できる', () => {
    const handleSendDM = vi.fn();

    render(
      <FriendsView
        friends={mockFriends}
        userProfile={INITIAL_USER_PROFILE}
        onSendDirectMessage={handleSendDM}
      />
    );

    expect(screen.getByText('フレンド一覧')).toBeInTheDocument();
    expect(screen.getAllByText('古都の閑寂')[0]).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/古都の閑寂 様へダイレクトメッセージを送信/);
    fireEvent.change(input, { target: { value: '本日もよいお天気ですね。' } });
    fireEvent.click(screen.getByRole('button', { name: '送信' }));

    expect(handleSendDM).toHaveBeenCalledWith(
      'user_kyoto',
      '本日もよいお天気ですね。',
      []
    );
  });
});
