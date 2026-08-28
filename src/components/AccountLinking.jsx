import { useEffect, useState } from 'react';
import { Apple, Check, Link2, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { getSupabase } from '@/lib/supabase';
import { getOAuthErrorFromLocation, getOAuthErrorMessage } from '@/lib/oauthErrors';
import GoogleIcon from '@/components/GoogleIcon';

const PROVIDERS = [
  { id: 'google', label: 'Google', icon: <GoogleIcon className="h-4 w-4" aria-hidden="true" /> },
  { id: 'apple', label: 'Apple', icon: <Apple className="h-4 w-4 fill-current" aria-hidden="true" /> },
  {
    id: 'azure',
    label: 'Microsoft',
    icon: <span className="grid h-4 w-4 grid-cols-2 gap-0.5" aria-hidden="true"><span className="bg-[#f35325]" /><span className="bg-[#81bc06]" /><span className="bg-[#05a6f0]" /><span className="bg-[#ffba08]" /></span>,
  },
];

export default function AccountLinking() {
  const { linkProvider } = useAuth();
  const [linkedProviders, setLinkedProviders] = useState(new Set());
  const [loadingProvider, setLoadingProvider] = useState('');
  const [error, setError] = useState('');

  const refreshIdentities = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data } = await supabase.auth.getUserIdentities();
    setLinkedProviders(new Set((data?.identities || []).map((identity) => identity.provider)));
  };

  useEffect(() => {
    const callbackError = getOAuthErrorFromLocation();
    if (callbackError) {
      setError(callbackError);
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    }
    refreshIdentities().catch(() => {});
  }, []);

  const handleLink = async (provider) => {
    if (loadingProvider || linkedProviders.has(provider.id)) return;
    setLoadingProvider(provider.id);
    setError('');
    try {
      await linkProvider(provider.id, '/settings');
    } catch (linkError) {
      setError(getOAuthErrorMessage(linkError));
      setLoadingProvider('');
    }
  };

  return (
    <section className="glass-card rounded-2xl p-5 sm:p-6" aria-labelledby="account-linking-title">
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary"><Link2 size={18} /></div>
        <div>
          <h2 id="account-linking-title" className="font-heading text-lg font-bold">Linked sign-in methods</h2>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">Keep your existing password account and add a social sign-in. You must already be signed in to link a provider.</p>
        </div>
      </div>
      {error && <div role="alert" className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      <div className="grid gap-2 sm:grid-cols-3">
        {PROVIDERS.map((provider) => {
          const isLinked = linkedProviders.has(provider.id);
          const isLoading = loadingProvider === provider.id;
          return (
            <button
              key={provider.id}
              type="button"
              onClick={() => handleLink(provider)}
              disabled={Boolean(loadingProvider) || isLinked}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-2 border-foreground/15 bg-background px-3 py-2.5 text-xs font-semibold transition-all hover:-translate-y-0.5 hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label={isLinked ? `${provider.label} linked` : `Link ${provider.label}`}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : isLinked ? <Check size={16} className="text-emerald-500" /> : provider.icon}
              <span>{isLinked ? 'Linked' : isLoading ? 'Opening…' : `Link ${provider.label}`}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">Linking never merges two separate Whisper accounts. If the provider email belongs to another account, the link is rejected and the existing accounts remain unchanged.</p>
    </section>
  );
}
