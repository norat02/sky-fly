import { useState, useEffect, useRef } from 'react';
import { translateText, getCachedTranslation } from '@/lib/openrouter';

function clean(s) {
  let t = String(s || '').trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    t = t.slice(1, -1).trim();
  }
  return t;
}

export function useTranslation(text, targetLang, enabled) {
  // Synchronous L1/L2 cache check for instant 0ms render
  const initialCached = (enabled && targetLang && text) ? getCachedTranslation(text, targetLang) : null;
  const [translated, setTranslated] = useState(initialCached);
  const [loading, setLoading] = useState(Boolean(enabled && targetLang && text && !initialCached));
  const [error, setError] = useState(null);
  const lastKeyRef = useRef('');

  useEffect(() => {
    if (!enabled || !targetLang || !text) {
      setTranslated(null);
      setLoading(false);
      setError(null);
      return;
    }

    const normText = text.trim();
    const key = `${targetLang}::${normText}`;
    lastKeyRef.current = key;

    // Check instant cache first
    const cached = getCachedTranslation(normText, targetLang);
    if (cached) {
      setTranslated(cached !== normText ? cached : null);
      setLoading(false);
      setError(null);
      return;
    }

    let isCancelled = false;
    setLoading(true);
    setError(null);

    translateText(normText, targetLang)
      .then((out) => {
        if (isCancelled || lastKeyRef.current !== key) return;
        const cleaned = clean(out || '');
        if (cleaned && cleaned !== normText) {
          setTranslated(cleaned);
        } else {
          setTranslated(null);
        }
        setLoading(false);
      })
      .catch(() => {
        if (isCancelled || lastKeyRef.current !== key) return;
        setTranslated(null);
        setLoading(false);
        setError('ERROR');
      });

    return () => {
      isCancelled = true;
    };
  }, [text, targetLang, enabled]);

  return { translated, loading, error };
}
