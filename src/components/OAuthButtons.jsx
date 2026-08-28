import { useState } from 'react';
import { Apple, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import GoogleIcon from '@/components/GoogleIcon';

const PROVIDERS = [
  {
    id: 'google',
    label: 'Google',
    icon: <GoogleIcon className="h-4 w-4" aria-hidden="true" />,
  },
  {
    id: 'apple',
    label: 'Apple',
    icon: <Apple className="h-4 w-4 fill-current" aria-hidden="true" />,
  },
  {
    id: 'azure',
    label: 'Microsoft',
    icon: (
      <span className="grid h-4 w-4 grid-cols-2 gap-0.5" aria-hidden="true">
        <span className="bg-[#f35325]" /><span className="bg-[#81bc06]" />
        <span className="bg-[#05a6f0]" /><span className="bg-[#ffba08]" />
      </span>
    ),
  },
];

export default function OAuthButtons({ returnTo = '/', onError, disabled = false }) {
  const { loginWithProvider } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState('');

  const handleProvider = async (provider) => {
    if (loadingProvider || disabled) return;
    setLoadingProvider(provider.id);
    onError?.('');
    try {
      const result = await loginWithProvider(provider.id, returnTo);
      if (result?.user && typeof window !== 'undefined') {
        window.location.assign(returnTo || '/');
      }
    } catch (error) {
      onError?.(error?.message || `Unable to continue with ${provider.label}. Please try again.`);
      setLoadingProvider('');
    }
  };

  return (
    <div className="space-y-3" aria-label="Social sign in options">
      <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <span className="h-px flex-1 bg-foreground/10" />
        <span>or continue with</span>
        <span className="h-px flex-1 bg-foreground/10" />
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {PROVIDERS.map((provider) => {
          const isLoading = loadingProvider === provider.id;
          return (
            <button
              key={provider.id}
              type="button"
              onClick={() => handleProvider(provider)}
              disabled={disabled || Boolean(loadingProvider)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-2 border-foreground/15 bg-background px-3 py-2.5 text-xs font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55"
              aria-label={`Continue with ${provider.label}`}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : provider.icon}
              <span>{isLoading ? 'Opening…' : provider.label}</span>
            </button>
          );
        })}
      </div>
      <p className="text-center text-[11px] leading-5 text-muted-foreground font-body">New accounts are created automatically after your provider confirms your identity.</p>
    </div>
  );
}
