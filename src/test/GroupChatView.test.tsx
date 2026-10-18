import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GroupChatView } from '../components/GroupChatView';
import { MatchRoom } from '../types';
import { INITIAL_USER_PROFILE } from '../data/initialData';

const mockRoom: MatchRoom = {
  id: 'room-1',
  createdAt: Date.now(),
  expiresAt: Date.now() + 600 * 1000,
  joinDeadline: Date.now() + 300 * 1000,
  participants: [
    { id: 'user-self', name: '旅人', avatar: '風' },
    { id: 'user-2', name: '風の便り', avatar: '楓' },
    { id: 'user-3', name: '夜桜の影', avatar: '桜', isDisconnected: true },
  ],
  messages: [
    {
      id: 'm-1',
      senderId: 'system',
      senderName: 'システム',
      senderAvatar: '風',
      content: '風が結びし対話の部屋がひらかれました。',
      createdAt: Date.now(),
      isSystem: true,
    },
    {
      id: 'm-2',
      senderId: 'user-2',
      senderName: '風の便り',
      senderAvatar: '楓',
      content: 'はじめまして。よろしくお願いいたします。',
      createdAt: Date.now(),
    },
  ],
  status: 'active',
  confirmations: {},
};

describe('10分グループチャット画面のテスト', () => {
  it('部屋の参加者、タイマー、メッセージが描画される', () => {
    const handleSend = vi.fn();
    const handleLeave = vi.fn();
    const handleExpire = vi.fn();

    render(
      <GroupChatView
        room={mockRoom}
        userProfile={INITIAL_USER_PROFILE}
        onSendMessage={handleSend}
        onLeaveRoom={handleLeave}
        onTimerExpire={handleExpire}
      />
    );

    expect(screen.getByText('3 / 4人')).toBeInTheDocument();
    expect(screen.getAllByText('風の便り')[0]).toBeInTheDocument();
    expect(screen.getByText('はじめまして。よろしくお願いいたします。')).toBeInTheDocument();
  });

  it('不意の切断が発生している場合にテロップが表示される', () => {
    render(
      <GroupChatView
        room={mockRoom}
        userProfile={INITIAL_USER_PROFILE}
        onSendMessage={vi.fn()}
        onLeaveRoom={vi.fn()}
        onTimerExpire={vi.fn()}
      />
    );

    expect(
      screen.getByText(/風が強まり、夜桜の影様が飛ばされてしまいました…/)
    ).toBeInTheDocument();
  });

  it('メッセージを送信できる', () => {
    const handleSend = vi.fn();

    render(
      <GroupChatView
        room={mockRoom}
        userProfile={INITIAL_USER_PROFILE}
        onSendMessage={handleSend}
        onLeaveRoom={vi.fn()}
        onTimerExpire={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText('言葉を風に乗せて伝える…');
    fireEvent.change(input, { target: { value: 'こんにちは！' } });
    fireEvent.click(screen.getByText('送信'));

    expect(handleSend).toHaveBeenCalledWith('こんにちは！');
  });

  it('「身を引く」ボタンを押すと途中離脱が呼ばれる', () => {
    const handleLeave = vi.fn();

    render(
      <GroupChatView
        room={mockRoom}
        userProfile={INITIAL_USER_PROFILE}
        onSendMessage={vi.fn()}
        onLeaveRoom={handleLeave}
        onTimerExpire={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('身を引く'));
    expect(handleLeave).toHaveBeenCalledTimes(1);
  });
});
