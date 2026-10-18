import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GroupChatView } from '../components/GroupChatView';
import { ChatRoom } from '../types';
import { INITIAL_USER_PROFILE } from '../data/initialData';

const mockRooms: ChatRoom[] = [
  {
    id: 'room-1',
    title: '読書と珈琲の部屋',
    description: 'お気に入りの本や珈琲について静かに語り合うお部屋です。',
    createdById: 'user_moon',
    createdByName: '月影の読書人',
    createdAt: Date.now(),
    messages: [
      {
        id: 'msg-1',
        roomId: 'room-1',
        senderId: 'user_moon',
        senderName: '月影の読書人',
        senderAvatar: '月',
        content: 'ようこそ。最近読んだ本はありますか。',
        createdAt: Date.now(),
      },
    ],
  },
];

describe('オープンチャットルーム画面のテスト', () => {
  it('ルーム一覧が描画され入室ボタンが機能する', () => {
    const handleJoin = vi.fn();

    render(
      <GroupChatView
        rooms={mockRooms}
        activeRoomId={null}
        userProfile={INITIAL_USER_PROFILE}
        onCreateRoom={vi.fn()}
        onJoinRoom={handleJoin}
        onLeaveRoom={vi.fn()}
        onSendMessage={vi.fn()}
      />
    );

    expect(screen.getByText('読書と珈琲の部屋')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '入室する' }));
    expect(handleJoin).toHaveBeenCalledWith('room-1');
  });

  it('新規ルーム作成モーダルからルームを作成できる', () => {
    const handleCreate = vi.fn();

    render(
      <GroupChatView
        rooms={mockRooms}
        activeRoomId={null}
        userProfile={INITIAL_USER_PROFILE}
        onCreateRoom={handleCreate}
        onJoinRoom={vi.fn()}
        onLeaveRoom={vi.fn()}
        onSendMessage={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'ルームを作成' }));
    expect(screen.getByText('新規チャットルームの作成')).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/ルーム名/);
    const descInput = screen.getByLabelText(/説明・案内文/);

    fireEvent.change(titleInput, { target: { value: '音楽のお部屋' } });
    fireEvent.change(descInput, { target: { value: '好きな音楽を語りましょう。' } });
    fireEvent.click(screen.getByRole('button', { name: '作成して入室' }));

    expect(handleCreate).toHaveBeenCalledWith('音楽のお部屋', '好きな音楽を語りましょう。');
  });

  it('入室中のチャットルームでメッセージを送信できる', () => {
    const handleSend = vi.fn();

    render(
      <GroupChatView
        rooms={mockRooms}
        activeRoomId="room-1"
        userProfile={INITIAL_USER_PROFILE}
        onCreateRoom={vi.fn()}
        onJoinRoom={vi.fn()}
        onLeaveRoom={vi.fn()}
        onSendMessage={handleSend}
      />
    );

    expect(screen.getByText('ようこそ。最近読んだ本はありますか。')).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/メッセージや @ユーザーID を入力/);
    fireEvent.change(input, { target: { value: 'おすすめの詩集を読みました。' } });
    fireEvent.click(screen.getByRole('button', { name: '送信' }));

    expect(handleSend).toHaveBeenCalledWith('room-1', 'おすすめの詩集を読みました。', []);
  });
});
