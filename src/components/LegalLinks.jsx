import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function LegalLinks({ className = '' }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground ${className}`}>
      <Link to="/legal" className="inline-flex items-center gap-1.5 font-semibold text-foreground transition-colors hover:text-primary hover:underline">
        <ShieldCheck size={12} className="text-emerald-600" />
        Legal & Safety Center
      </Link>
      <span aria-hidden="true">·</span>
      <Link to="/legal/terms-of-service" className="transition-colors hover:text-primary hover:underline">Terms</Link>
      <Link to="/legal/privacy-policy" className="transition-colors hover:text-primary hover:underline">Privacy</Link>
      <Link to="/legal/community-guidelines" className="transition-colors hover:text-primary hover:underline">Community</Link>
    </div>
  );
}
