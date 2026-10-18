import { ShieldCheck } from 'lucide-react';

interface VerifiedBadgeProps {
  isVerified?: boolean;
}

export const VerifiedBadge = ({ isVerified }: VerifiedBadgeProps) => {
  if (!isVerified) return null;

  return (
    <span className="verified-badge" title="2段階認証済">
      <ShieldCheck size={14} className="verified-icon" />
      <span className="verified-text">認証済</span>
    </span>
  );
};
