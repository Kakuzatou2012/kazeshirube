import { useState } from 'react';
import { AuthAccount, UserProfile } from '../types';
import { LogIn, UserPlus, ShieldCheck, X, Check, Mail, Key, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  accounts: AuthAccount[];
  onLogin: (account: AuthAccount) => void;
  onRegister: (newAccount: AuthAccount) => void;
  onVerify2FA: (email: string) => void;
}

export const AuthModal = ({
  isOpen,
  onClose,
  currentUser,
  accounts,
  onLogin,
  onRegister,
  onVerify2FA,
}: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register' | '2fa'>('login');

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(currentUser.email || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const matched = accounts.find(
      (acc) => acc.username === username && acc.password === password
    );

    if (!matched) {
      setErrorMsg('ユーザー名またはパスワードが正しくありません。');
      return;
    }

    onLogin(matched);
    setSuccessMsg('ログインいたしました。');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (accounts.some((acc) => acc.username === username)) {
      setErrorMsg('そのユーザー名はすでに使用されております。');
      return;
    }

    const newAcc: AuthAccount = {
      id: `user-${Date.now()}`,
      username: username.trim(),
      password,
      email: email.trim(),
      is2FAVerified: false,
      avatar: '風',
      bio: '静かな場所を好み、風に乗せて言葉を綴ります。',
    };

    onRegister(newAcc);
    setSuccessMsg('アカウントを登録いたしました。');

    if (email.trim()) {
      setTimeout(() => {
        setSuccessMsg('');
        setMode('2fa');
      }, 1000);
    } else {
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    }
  };

  const handleSendCode = () => {
    if (!email.trim()) {
      setErrorMsg('メールアドレスを入力してください。');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setErrorMsg('');
    setSuccessMsg(`確認コードを発行いたしました 証明コード ${code}`);
  };

  const handleVerify2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (generatedCode && verificationCode.trim() !== generatedCode) {
      setErrorMsg('確認コードが一致いたしません。');
      return;
    }

    onVerify2FA(email.trim());
    setSuccessMsg('2段階認証が完了いたしました。認証済マークが付与されます。');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <LogIn size={20} className="modal-title-icon" />
            <h2>
              {mode === 'login'
                ? 'ログイン'
                : mode === 'register'
                ? 'アカウント登録'
                : '2段階認証'}
            </h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="閉じる">
            <X size={20} />
          </button>
        </div>

        <div className="auth-tab-bar">
          <button
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
          >
            <LogIn size={15} /> ログイン
          </button>
          <button
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
          >
            <UserPlus size={15} /> アカウント登録
          </button>
          <button
            className={`auth-tab-btn ${mode === '2fa' ? 'active' : ''}`}
            onClick={() => {
              setMode('2fa');
              setErrorMsg('');
            }}
          >
            <ShieldCheck size={15} /> 2段階認証
          </button>
        </div>

        <div className="modal-body">
          {errorMsg && <div className="auth-error-box">{errorMsg}</div>}
          {successMsg && <div className="auth-success-box">{successMsg}</div>}

          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="auth-login-username">
                  <User size={14} /> ユーザー名
                </label>
                <input
                  id="auth-login-username"
                  type="text"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-login-password">
                  <Key size={14} /> パスワード
                </label>
                <input
                  id="auth-login-password"
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="modal-footer" style={{ padding: '1rem 0 0 0', borderTop: 'none' }}>
                <button type="submit" className="primary-button" style={{ width: '100%', justifyContent: 'center' }}>
                  <LogIn size={16} /> ログインする
                </button>
              </div>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="auth-reg-username">
                  <User size={14} /> ユーザー名
                </label>
                <input
                  id="auth-reg-username"
                  type="text"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-reg-password">
                  <Key size={14} /> パスワード
                </label>
                <input
                  id="auth-reg-password"
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-reg-email">
                  <Mail size={14} /> メールアドレス 2段階認証用 任意
                </label>
                <input
                  id="auth-reg-email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@kazeshirube.jp"
                />
              </div>

              <div className="modal-footer" style={{ padding: '1rem 0 0 0', borderTop: 'none' }}>
                <button type="submit" className="primary-button" style={{ width: '100%', justifyContent: 'center' }}>
                  <UserPlus size={16} /> アカウントを登録する
                </button>
              </div>
            </form>
          )}

          {mode === '2fa' && (
            <form onSubmit={handleVerify2FASubmit}>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                メールアドレスを認証することにより、お名前の横に安全の証である2段階認証マーク（認証済バッジ）が付与されます。
              </p>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-2fa-email">
                  <Mail size={14} /> 送信先メールアドレス
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    id="auth-2fa-email"
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={handleSendCode}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    コード発行
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-2fa-code">
                  6桁の確認コード
                </label>
                <input
                  id="auth-2fa-code"
                  type="text"
                  className="form-input"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  placeholder="123456"
                  required
                />
              </div>

              <div className="modal-footer" style={{ padding: '1rem 0 0 0', borderTop: 'none' }}>
                <button type="submit" className="primary-button" style={{ width: '100%', justifyContent: 'center' }}>
                  <Check size={16} /> 2段階認証を完了する
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
