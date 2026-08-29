import BackgroundOrbs from '@/components/BackgroundOrbs';
import { ArrowUpRight, Sparkles, Wand2 } from 'lucide-react';
import LegalLinks from '@/components/LegalLinks';
import BrandLogo from '@/components/BrandLogo';

export default function AuthLayout({ icon: Icon, title, subtitle = '', footer = null, children = null }) {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <BackgroundOrbs />
      <div className="auth-orbit" aria-hidden="true" />

      <main className="relative z-10 mx-auto grid min-h-[100dvh] w-full max-w-6xl items-center gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-12 lg:py-12">
        <section className="hidden lg:block" aria-label="Whisper introduction">
          <div className="mb-10 flex items-center gap-3">
            <BrandLogo compact />
          </div>

          <div className="max-w-xl">
            <p className="eyebrow mb-5 flex items-center gap-2"><Wand2 size={13} className="text-accent" /> Private by design</p>
            <h2 className="font-display text-6xl font-semibold leading-[0.98] tracking-[-0.04em] text-foreground xl:text-7xl">
              Make space for the conversations that matter.
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
              A calm, multilingual sketchbook for your everyday messages, ideas, and small moments shared with the people you trust.
            </p>
          </div>

          <div className="relative mt-12 max-w-md rotate-[-2deg] rounded-[1.75rem] border border-foreground/10 bg-card/90 p-5 shadow-xl backdrop-blur-sm transition-transform hover:rotate-0">
            <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-accent/15" />
                <div>
                  <p className="text-sm font-semibold">Quiet corner</p>
                  <p className="text-xs text-muted-foreground">A shared sketchbook</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600">Live</span>
            </div>
            <div className="space-y-3 pt-4 text-sm">
              <div className="ml-auto max-w-[78%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-primary-foreground">Let’s leave a little room for the unfinished ideas.</div>
              <div className="max-w-[76%] rounded-2xl rounded-bl-md bg-secondary px-4 py-3 text-secondary-foreground">That is exactly where the good ones begin.</div>
            </div>
            <div className="mt-5 flex items-center gap-2 text-[11px] text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> end-to-end encrypted</div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowUpRight size={14} className="text-accent" />
            Built for focus, not noise.
          </div>
        </section>

        <section className="mx-auto w-full max-w-md lg:max-w-[26rem]">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <BrandLogo compact className="max-w-[10rem]" />
            <p className="text-xs text-muted-foreground">A quieter way to connect</p>
          </div>

          <div className="mb-7 text-center lg:text-left">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/12 text-accent lg:hidden">
              {Icon ? <Icon className="h-6 w-6" aria-hidden="true" /> : <Sparkles className="h-6 w-6" />}
            </div>
            <p className="eyebrow mb-2">Your private sketchbook</p>
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-5xl lg:text-4xl">{title}</h1>
            {subtitle && <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground lg:mx-0">{subtitle}</p>}
          </div>

          <div className="glass-card rounded-[1.75rem] p-5 sm:p-7">
            {children}
          </div>

          {footer && <div className="mt-6 text-center text-sm text-muted-foreground lg:text-left">{footer}</div>}
          <LegalLinks className="mt-5 lg:justify-start" />
        </section>
      </main>
    </div>
  );
}
