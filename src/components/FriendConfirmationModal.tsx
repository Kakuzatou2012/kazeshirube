import { useState } from 'react';
import { MatchRoomParticipant, Friend } from '../types';
import { HeartHandshake, Check, X, Sparkles } from 'lucide-react';

interface FriendConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: MatchRoomParticipant[];
  selfId: string;
  onConfirmFriendship: (newFriends: Friend[]) => void;
}

export const FriendConfirmationModal = ({
  isOpen,
  onClose,
  participants,
  selfId,
  onConfirmFriendship,
}: FriendConfirmationModalProps) => {
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
          avatar: p.avatar,
          bio: '風の対話で縁を結んだ大切なお相手です。',
          connectedAt: Date.now(),
          messages: [
            {
              id: `dm-init-${p.id}`,
              senderId: p.id,
              content: 'この度は縁を結んでいただきありがとうございます。今後ともよろしくお願いいたします。',
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
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <HeartHandshake size={22} className="modal-title-icon" />
            <h2>この方と縁を結びますか？</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="閉じる">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {isSubmitted ? (
            <div className="submit-success-box">
              <Sparkles size={36} style={{ marginBottom: '1rem', color: 'var(--accent-gold)' }} />
              <p className="success-title">お互いの意志が確認されました</p>
              <p>相互に縁を結んだ方は結ばれし縁一覧に追加されました。引き続き個別メッセージにて対話をお楽しみいただけます。</p>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                10分間の対話のひととき、誠にありがとうございました。
                お互いに縁を結ぶを選択した場合のみ、フレンドとして登録され個別のメッセージを交わすことができるようになります。
              </p>

              <div className="confirmation-participants-list">
                {others.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>他の対話相手はいませんでした。</p>
                ) : (
                  others.map((p) => {
                    const currentChoice = choices[p.id];
                    return (
                      <div key={p.id} className="confirmation-item">
                        <div className="confirmation-user-info">
                          <span className="confirmation-avatar">{p.avatar || '風'}</span>
                          <span className="confirmation-name">{p.name}様</span>
                        </div>
                        <div className="confirmation-actions">
                          <button
                            type="button"
                            className={`choice-btn connect ${currentChoice === true ? 'selected' : ''}`}
                            onClick={() => handleSelectChoice(p.id, true)}
                          >
                            <Check size={16} />
                            縁を結ぶ
                          </button>
                          <button
                            type="button"
                            className={`choice-btn decline ${currentChoice === false ? 'selected' : ''}`}
                            onClick={() => handleSelectChoice(p.id, false)}
                          >
                            <X size={16} />
                            静かに見送る
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
              意志を決定する
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
