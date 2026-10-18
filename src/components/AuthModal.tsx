import React, { useState } from 'react';
import { AuthAccount, UserProfile } from '../types';
import { LogIn, UserPlus, ShieldCheck, Mail, Key, User, AtSign, Sparkles, X, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  isForcedLogin?: boolean;
  currentUser: UserProfile | null;
  accounts: AuthAccount[];
  onLogin: (account: AuthAccount) => void;
  onRegister: (newAccount: AuthAccount) => void;
  onVerify2FA: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  isForcedLogin = false,
  currentUser,
  accounts,
  onLogin,
  onRegister,
  onVerify2FA,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | '2fa'>('login');

  // Form states
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setUserId('');
    setName('');
    setPassword('');
    setEmail('');
    setVerificationCodeInput('');
    setSentCode(null);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedId = userId.trim();
    const matched = accounts.find(
      (acc) => (acc.id === trimmedId || acc.email === trimmedId) && acc.password === password
    );

    if (!matched) {
      setErrorMsg('ユーザーIDまたはパスワードが正しくありません。');
      return;
    }

    if (matched.isFrozen) {
      setErrorMsg('このアカウントは現在凍結されております。運営までお問い合わせください。');
      return;
    }

    onLogin(matched);
    setSuccessMsg('ログインいたしました。');
    setTimeout(() => {
      setSuccessMsg('');
      resetForm();
      if (onClose) onClose();
    }, 1000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedId = userId.trim();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!/^[a-zA-Z0-9_]+$/.test(trimmedId)) {
      setErrorMsg('ユーザーID (@id) は半角英数字およびアンダースコアのみ使用可能です。');
      return;
    }

    if (accounts.some((acc) => acc.id === trimmedId)) {
      setErrorMsg('そのユーザーID (@id) はすでに使用されております。');
      return;
    }

    const newAcc: AuthAccount = {
      id: trimmedId,
      name: trimmedName || trimmedId,
      password,
      email: trimmedEmail,
      is2FAVerified: false,
      avatar: '風',
      bio: '',
      isFrozen: false,
      role: trimmedId === 'kakuzatou' ? 'admin' : 'user',
    };

    onRegister(newAcc);
    setSuccessMsg('アカウントを新規登録いたしました。');

    if (trimmedEmail) {
      setTimeout(() => {
        setSuccessMsg('');
        setMode('2fa');
      }, 1000);
    } else {
      setTimeout(() => {
        setSuccessMsg('');
        resetForm();
        if (onClose) onClose();
      }, 1200);
    }
  };

  const handleSendCode = () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) {
      setErrorMsg('メールアドレスを入力してください。');
      return;
    }

    // Generate internal mock 6-digit verification code
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(generated);

    // IMPORTANT: Do NOT display code on screen!
    setSuccessMsg('ご登録のメールアドレス宛に認証コードを送信いたしました。');
  };

  const handleVerify2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!sentCode) {
      setErrorMsg('先に認証コードの送信を行ってください。');
      return;
    }

    if (verificationCodeInput.trim() !== sentCode) {
      setErrorMsg('入力された認証コードが一致いたしません。');
      return;
    }

    onVerify2FA(email.trim());
    setSuccessMsg('2段階認証が完了いたしました。認証済マークが付与されます。');
    setTimeout(() => {
      setSuccessMsg('');
      resetForm();
      if (onClose) onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={isForcedLogin ? undefined : onClose}>
      <div className="modal-card auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <LogIn size={20} className="modal-title-icon" />
            <h2>
              {mode === 'login'
                ? 'ログイン'
                : mode === 'register'
                ? '新規アカウント登録'
                : '2段階認証'}
            </h2>
          </div>
          {!isForcedLogin && onClose && (
            <button className="icon-button" onClick={onClose} aria-label="閉じる">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="auth-tab-bar">
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
          >
            <LogIn size={15} /> ログイン
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
          >
            <UserPlus size={15} /> 新規登録
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${mode === '2fa' ? 'active' : ''}`}
            onClick={() => {
              setMode('2fa');
              setErrorMsg('');
              setSuccessMsg('');
            }}
          >
            <ShieldCheck size={15} /> 2段階認証
          </button>
        </div>

        <div className="modal-body">
          {isForcedLogin && (
            <div style={{ marginBottom: '1.25rem', textAlign: 'center', color: 'var(--accent-teal)' }}>
              <Sparkles size={24} style={{ marginBottom: '0.4rem' }} />
              <p style={{ fontSize: '0.92rem', fontWeight: 600 }}>風標へようこそ</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                サービスをご利用いただくにはログインまたはアカウント登録が必要です。
              </p>
            </div>
          )}

          {errorMsg && <div className="auth-error-box">{errorMsg}</div>}
          {successMsg && <div className="auth-success-box">{successMsg}</div>}

          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="auth-login-id">
                  <AtSign size={14} /> ユーザーID (@id) またはメールアドレス
                </label>
                <input
                  id="auth-login-id"
                  type="text"
                  className="form-input"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="例: user_sakura または kakuzatou"
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
                <label className="form-label" htmlFor="auth-reg-id">
                  <AtSign size={14} /> ユーザーID (@id) ※登録後の変更不可
                </label>
                <input
                  id="auth-reg-id"
                  type="text"
                  className="form-input"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="半角英数字 (例: sakura_123)"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-reg-name">
                  <User size={14} /> 表示名 (お名前)
                </label>
                <input
                  id="auth-reg-name"
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例: 桜井"
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
                  <Mail size={14} /> メールアドレス (2段階認証用・任意)
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
                  <UserPlus size={16} /> アカウントを新規登録する
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
                    コード送信
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-2fa-code">
                  6桁の認証コード
                </label>
                <input
                  id="auth-2fa-code"
                  type="text"
                  className="form-input"
                  value={verificationCodeInput}
                  onChange={(e) => setVerificationCodeInput(e.target.value)}
                  maxLength={6}
                  placeholder="認証コードを入力"
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
