import { InfoModalType } from './InfoDialogModal';

interface FooterProps {
  onOpenInfoModal: (type: InfoModalType) => void;
  onOpenNoticeModal: () => void;
}

export const Footer = ({ onOpenInfoModal, onOpenNoticeModal }: FooterProps) => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="footer-brand-title">風標</p>
        <p className="footer-subtitle">静かな言葉が紡ぐ一期一会のコミュニティ</p>

        <div className="footer-links">
          <button className="footer-link" onClick={onOpenNoticeModal}>
            お知らせ
          </button>
          <span className="footer-divider">•</span>
          <button className="footer-link" onClick={() => onOpenInfoModal('terms')}>
            利用規約
          </button>
          <span className="footer-divider">•</span>
          <button className="footer-link" onClick={() => onOpenInfoModal('privacy')}>
            プライバシーポリシー
          </button>
          <span className="footer-divider">•</span>
          <button className="footer-link" onClick={() => onOpenInfoModal('contact')}>
            お問い合わせ 通報
          </button>
        </div>

        <p className="footer-lang-note">※ 当コミュニティは日本語での対話を前提としております。</p>
        <p className="footer-copy">© 2025 風標. All rights reserved.</p>
      </div>
    </footer>
  );
};
