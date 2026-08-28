import { useState } from 'react';
import { Languages, Sparkles } from 'lucide-react';
import LinkText from './LinkText';
import { useTranslation } from '@/hooks/useTranslation';

export default function TranslatedText({ text, targetLang, enabled }) {
  const [showOriginal, setShowOriginal] = useState(false);
  const { translated, loading } = useTranslation(text, targetLang, enabled);
  const direction = ['ar', 'he', 'fa', 'ur'].includes(targetLang) ? 'rtl' : 'ltr';

  if (!enabled || !targetLang) {
    return (
      <p dir={direction} className="text-start text-xs leading-relaxed whitespace-pre-wrap break-words sm:text-sm font-body">
        <LinkText text={text} />
      </p>
    );
  }

  if (loading && !translated) {
    return (
      <div dir={direction} className="space-y-1">
        <p dir={direction} className="text-start text-xs leading-relaxed whitespace-pre-wrap break-words opacity-75 sm:text-sm font-body">
          <LinkText text={text} />
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-card/40 px-2 py-0.5 text-[10px] text-muted-foreground sketch-border font-hand">
          <Sparkles size={10} className="animate-spin text-primary" />
          <span>whisper slm translating…</span>
        </span>
      </div>
    );
  }

  if (!translated || translated === text) {
    return (
      <p dir={direction} className="text-start text-xs leading-relaxed whitespace-pre-wrap break-words sm:text-sm font-body">
        <LinkText text={text} />
      </p>
    );
  }

  if (showOriginal) {
    return (
      <div dir={direction} className="space-y-1">
        <p dir={direction} className="text-start text-xs leading-relaxed whitespace-pre-wrap break-words sm:text-sm font-body">
          <LinkText text={text} />
        </p>
        <button
          type="button"
          onClick={() => setShowOriginal(false)}
          className="inline-flex items-center gap-1 rounded-md bg-card/30 px-1.5 py-0.5 text-[10px] text-primary sketch-border font-hand hover:underline"
        >
          <Languages size={10} /> see translation
        </button>
      </div>
    );
  }

  return (
    <div dir={direction} className="space-y-1">
      <p dir={direction} className="text-start text-xs leading-relaxed whitespace-pre-wrap break-words sm:text-sm font-body">
        <LinkText text={translated} />
      </p>
      <button
        type="button"
        onClick={() => setShowOriginal(true)}
        className="inline-flex items-center gap-1 rounded-md bg-card/30 px-1.5 py-0.5 text-[10px] text-muted-foreground sketch-border font-hand hover:text-foreground hover:underline"
      >
        <Sparkles size={10} className="text-primary" />
        <span>translated · see original</span>
      </button>
    </div>
  );
}
