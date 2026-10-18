import React, { useState } from 'react';
import { Friend } from '../types';
import { HeartHandshake, Check, X, Sparkles } from 'lucide-react';

export interface ConfirmationParticipant {
  id: string;
  name: string;
  avatar?: string;
}

interface FriendConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: ConfirmationParticipant[];
  selfId: string;
  onConfirmFriendship: (newFriends: Friend[]) => void;
}

export const FriendConfirmationModal: React.FC<FriendConfirmationModalProps> = ({
  isOpen,
  onClose,
  participants,
  selfId,
  onConfirmFriendship,
}) => {
  const [choices, setChoices] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const others = participants.filter((p) => p.id !== selfId);

  const handleSelectChoice = (participantId: string, wantConnect: boolean) => {
    setChoices((prev) => ({
      ...prev,
      [participantId]: wantConnect,
    }));
  };

  const handleSubmit = () => {
    const newFriends: Friend[] = [];

    others.forEach((p) => {
      if (choices[p.id] === true) {
        newFriends.push({
          id: p.id,
          name: p.name,
          avatar: p.avatar || '風',
          bio: '',
          connectedAt: Date.now(),
          messages: [
            {
              id: `dm-init-${p.id}`,
              senderId: p.id,
              receiverId: selfId,
              content: 'この度はフレンド登録ありがとうございます。よろしくお願いいたします。',
              createdAt: Date.now(),
            },
          ],
        });
      }
    });

    setIsSubmitted(true);
    onConfirmFriendship(newFriends);

    setTimeout(() => {
      setIsSubmitted(false);
      setChoices({});
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <HeartHandshake size={22} className="modal-title-icon" />
            <h2>この方とフレンドになりますか？</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="閉じる">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {isSubmitted ? (
            <div className="submit-success-box">
              <Sparkles size={36} style={{ marginBottom: '1rem', color: 'var(--accent-gold)' }} />
              <p className="success-title">意志が確認されました</p>
              <p>相互に登録を選択した場合はフレンド一覧に追加されます。</p>
            </div>
          ) : (
            <div>
              <div className="confirmation-participants-list">
                {others.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>他のお相手はいませんでした。</p>
                ) : (
                  others.map((p) => {
                    const currentChoice = choices[p.id];
                    return (
                      <div key={p.id} className="confirmation-item">
                        <div className="confirmation-user-info">
                          <span className="confirmation-avatar">{p.avatar || '風'}</span>
                          <span className="confirmation-name">{p.name} 様</span>
                        </div>
                        <div className="confirmation-actions">
                          <button
                            type="button"
                            className={`choice-btn connect ${currentChoice === true ? 'selected' : ''}`}
                            onClick={() => handleSelectChoice(p.id, true)}
                          >
                            <Check size={16} />
                            登録する
                          </button>
                          <button
                            type="button"
                            className={`choice-btn decline ${currentChoice === false ? 'selected' : ''}`}
                            onClick={() => handleSelectChoice(p.id, false)}
                          >
                            <X size={16} />
                            見送る
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {!isSubmitted && (
          <div className="modal-footer">
            <button className="secondary-button" onClick={onClose}>
              後で確認する
            </button>
            <button
              className="primary-button"
              onClick={handleSubmit}
              disabled={others.length > 0 && Object.keys(choices).length < others.length}
            >
              決定する
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
