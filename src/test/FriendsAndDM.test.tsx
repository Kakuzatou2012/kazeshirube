import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FriendConfirmationModal } from '../components/FriendConfirmationModal';
import { FriendsView } from '../components/FriendsView';
import { Friend, MatchRoomParticipant } from '../types';
import { INITIAL_USER_PROFILE } from '../data/initialData';

const mockParticipants: MatchRoomParticipant[] = [
  { id: 'user-self', name: '旅人', avatar: '風' },
  { id: 'user-friend-1', name: '紅葉の長老', avatar: '楓' },
];

const mockFriends: Friend[] = [
  {
    id: 'user-friend-1',
    name: '紅葉の長老',
    avatar: '楓',
    bio: '風の対話で縁を結んだ大切なお相手です。',
    connectedAt: Date.now(),
    messages: [
      {
        id: 'dm-1',
        senderId: 'user-friend-1',
        content: '今後ともよろしくお願いいたします。',
        createdAt: Date.now(),
      },
    ],
  },
];

describe('縁結び確認モーダルとフレンド・DM画面のテスト', () => {
  it('縁結び確認モーダルで「縁を結ぶ」を選択して決定できる', () => {
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();

    render(
      <FriendConfirmationModal
        isOpen={true}
        onClose={handleClose}
        participants={mockParticipants}
        selfId="user-self"
        onConfirmFriendship={handleConfirm}
      />
    );

    expect(screen.getByText('この方と縁を結びますか？')).toBeInTheDocument();
    expect(screen.getByText('紅葉の長老様')).toBeInTheDocument();

    fireEvent.click(screen.getByText('縁を結ぶ'));
    fireEvent.click(screen.getByText('意志を決定する'));

    expect(handleConfirm).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'user-friend-1',
          name: '紅葉の長老',
        }),
      ])
    );
  });

  it('フレンド一覧画面で1対1のDMを送信できる', () => {
    const handleSendDM = vi.fn();

    render(
      <FriendsView
        friends={mockFriends}
        userProfile={INITIAL_USER_PROFILE}
        onSendDirectMessage={handleSendDM}
      />
    );

    expect(screen.getByText('結ばれし縁')).toBeInTheDocument();
    expect(screen.getByText('紅葉の長老様との文通')).toBeInTheDocument();

    const input = screen.getByPlaceholderText('紅葉の長老様へ個別の言葉を届ける…');
    fireEvent.change(input, { target: { value: '本日も風が心地よいですね。' } });
    fireEvent.click(screen.getByText('送る'));

    expect(handleSendDM).toHaveBeenCalledWith(
      'user-friend-1',
      '本日も風が心地よいですね。'
    );
  });
});
