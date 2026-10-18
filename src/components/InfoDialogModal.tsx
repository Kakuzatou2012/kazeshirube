import { useState } from 'react';
import { X, ShieldCheck, FileText, Send } from 'lucide-react';

export type InfoModalType = 'terms' | 'privacy' | 'contact' | null;

interface InfoDialogModalProps {
  type: InfoModalType;
  onClose: () => void;
}

export const InfoDialogModal = ({ type, onClose }: InfoDialogModalProps) => {
  const [contactSubject, setContactSubject] = useState('不適切な投稿の通報');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!type) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContactSubject('不適切な投稿の通報');
      setContactMessage('');
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {type === 'terms' && (
          <>
            <div className="modal-header">
              <div className="modal-header-title">
                <FileText size={20} className="modal-title-icon" />
                <h2>利用規約</h2>
              </div>
              <button className="icon-button" onClick={onClose} aria-label="閉じる">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body doc-content">
              <h3>第1条 目的</h3>
              <p>
                本規約は、完全無料コミュニティ 風標 が提供するすべてのサービスの利用条件を定めるものです。
              </p>

              <h3>第2条 対話の言語と姿勢</h3>
              <p>
                当サイトは、丁寧な日本語による穏やかな対話を基本理念としております。他者を尊重し、公序良俗に反する発言や差別的・暴力的な言動は厳しく禁止いたします。
              </p>

              <h3>第3条 禁止事項</h3>
              <p>
                1 誹謗中傷、荒らし行為、過度な連投<br />
                2 商用利用、宣伝行為、スパム発信<br />
                3 個人情報の無断開示・収集<br />
                4 その他、運営が不適切と判断する行為
              </p>

              <h3>第4条 サービスの停止と改定</h3>
              <p>
                当サイトは、事前予告なくサービスの追加、変更、点検整備を実施できるものとします。
              </p>
            </div>
            <div className="modal-footer">
              <button className="primary-button" onClick={onClose}>
                同意して閉じる
              </button>
            </div>
          </>
        )}

        {type === 'privacy' && (
          <>
            <div className="modal-header">
              <div className="modal-header-title">
                <ShieldCheck size={20} className="modal-title-icon" />
                <h2>プライバシーポリシー</h2>
              </div>
              <button className="icon-button" onClick={onClose} aria-label="閉じる">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body doc-content">
              <h3>第1条 個人情報の扱い</h3>
              <p>
                風標はユーザーのプライバシーを最優先いたします。会員登録不要・完全無料でご利用いただけ、氏名や電話番号などの個人情報は保持いたしません。
              </p>

              <h3>第2条 ローカルデータ</h3>
              <p>
                表示名や環境設定、フレンドデータ等は、お客様のブラウザ内にのみ保存されます。
              </p>

              <h3>第3条 アクセス解析</h3>
              <p>
                サイトの品質向上のため、匿名化されたアクセスログを収集する場合がございます。
              </p>
            </div>
            <div className="modal-footer">
              <button className="primary-button" onClick={onClose}>
                確認いたしました
              </button>
            </div>
          </>
        )}

        {type === 'contact' && (
          <>
            <div className="modal-header">
              <div className="modal-header-title">
                <Send size={20} className="modal-title-icon" />
                <h2>お問い合わせ 通報</h2>
              </div>
              <button className="icon-button" onClick={onClose} aria-label="閉じる">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {submitted ? (
                <div className="submit-success-box">
                  <p className="success-title">送信いたしました</p>
                  <p>運営チームにて確認のうえ、適切に対処させていただきます。ご協力ありがとうございました。</p>
                </div>
              ) : (
                <form id="contact-form" onSubmit={handleContactSubmit}>
                  <p className="contact-notice">
                    不適切な発言の通報、またはサイト運営へのご意見・お問い合わせをお受けいたします。
                  </p>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-subject">件名 種別</label>
                    <select
                      id="contact-subject"
                      className="form-select"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                    >
                      <option value="不適切な投稿の通報">不適切な投稿・発言の通報</option>
                      <option value="不具合のご報告">不具合・バグのご報告</option>
                      <option value="運営へのご意見・ご要望">運営へのご意見・ご要望</option>
                      <option value="その他">その他のお問い合わせ</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-message">内容</label>
                    <textarea
                      id="contact-message"
                      className="form-textarea"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      rows={4}
                      required
                      placeholder="詳細をご記入ください…"
                    />
                  </div>
                </form>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="secondary-button" onClick={onClose}>
                閉じる
              </button>
              {!submitted && (
                <button type="submit" form="contact-form" className="primary-button">
                  送信する
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
