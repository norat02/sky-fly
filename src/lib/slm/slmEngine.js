// Whisper SLM (Small Language Model) Unified Translation Engine
// Tier 0: In-Memory & LocalStorage Neural Cache (0ms)
// Tier 1: Local Lexicon & Chat Slang SLM Matrix (0ms)
// Tier 2: Server-Side Gemini 3.7 Flash SLM Endpoint (/api/translate) (~120ms)
// Tier 3: Zero-Config Web Translation Fallback
// Tier 4: User-Configured Custom API Keys (OpenRouter, DeepSeek, OpenAI, etc.)

import { SLM_DICTIONARY } from './slmDictionary';
import { extractPunctuationWrapper, formatPreservedText, isNonTranslatable } from './slmTokenizer';

const PROVIDER_STORAGE = 'whisper_ai_provider';
const CACHE_STORAGE = 'whisper_slm_cache_v3';
const MAX_LOCAL_CACHE = 1000;

export const AI_PROVIDERS = [
  {
    id: 'whisper_slm',
    name: 'Whisper SLM Engine',
    badge: '⚡ Instant & Gemini Flash • Built-in',
    icon: 'Sparkles',
    desc: 'Ultra-fast sub-millisecond local lexicon + Server Gemini Flash SLM model.',
  },
  {
    id: 'builtin',
    name: 'Free Web Engine',
    badge: '100% Free • No Key Needed',
    icon: 'Globe',
    desc: 'Zero-key public translation service fallback.',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter AI',
    badge: 'Free & Custom Models',
    icon: 'Cpu',
    desc: 'Use OpenRouter free or custom models with your API key.',
  },
  {
    id: 'gemini',
    name: 'Google AI Studio Key',
    badge: 'Custom Gemini Key',
    icon: 'Zap',
    desc: 'Direct client-side key with Gemini models.',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek AI',
    badge: 'DeepSeek V3 / R1',
    icon: 'Brain',
    desc: 'DeepSeek direct API key.',
  },
  {
    id: 'openai',
    name: 'OpenAI / ChatGPT',
    badge: 'GPT-4o & GPT-4o mini',
    icon: 'Bot',
    desc: 'OpenAI API key.',
  },
];

export const LANGUAGE_MAP = {
  en: 'English',
  es: 'Spanish',
  hi: 'Hindi',
  hinglish: 'Hinglish (Hindi in English Script)',
  fr: 'French',
  de: 'German',
  ja: 'Japanese',
  zh: 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  ko: 'Korean',
  pt: 'Portuguese',
  ru: 'Russian',
  ar: 'Arabic',
  it: 'Italian',
  tr: 'Turkish',
  vi: 'Vietnamese',
  id: 'Indonesian',
  bn: 'Bengali',
  ur: 'Urdu',
  ta: 'Tamil',
  te: 'Telugu',
  mr: 'Marathi',
  nl: 'Dutch',
  pl: 'Polish',
  th: 'Thai',
  fa: 'Persian',
  sv: 'Swedish',
  uk: 'Ukrainian',
  tl: 'Filipino (Tagalog)',
  ms: 'Malay',
  he: 'Hebrew',
  el: 'Greek',
  cs: 'Czech',
  ro: 'Romanian',
  hu: 'Hungarian',
  da: 'Danish',
  no: 'Norwegian',
  fi: 'Finnish',
};

// Storage Getters & Setters
export function getActiveProvider() {
  try {
    return localStorage.getItem(PROVIDER_STORAGE) || 'whisper_slm';
  } catch {
    return 'whisper_slm';
  }
}

export function setActiveProvider(providerId) {
  try {
    localStorage.setItem(PROVIDER_STORAGE, providerId);
  } catch {
    // ignore
  }
}

export function getProviderApiKey(providerId) {
  try {
    switch (providerId) {
      case 'openrouter':
        return localStorage.getItem('openrouter_api_key') || import.meta.env.VITE_OPENROUTER_API_KEY || '';
      case 'gemini':
        return localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
      case 'deepseek':
        return localStorage.getItem('deepseek_api_key') || import.meta.env.VITE_DEEPSEEK_API_KEY || '';
      case 'openai':
        return localStorage.getItem('openai_api_key') || import.meta.env.VITE_OPENAI_API_KEY || '';
      default:
        return '';
    }
  } catch {
    return '';
  }
}

export function setProviderApiKey(providerId, key) {
  try {
    const k = (key || '').trim();
    const storageKey = `${providerId}_api_key`;
    if (k) localStorage.setItem(storageKey, k);
    else localStorage.removeItem(storageKey);
  } catch {
    // ignore
  }
}

export function getProviderModel(providerId) {
  try {
    switch (providerId) {
      case 'openrouter':
        return localStorage.getItem('openrouter_model') || 'google/gemini-2.0-flash-exp:free';
      case 'gemini':
        return localStorage.getItem('gemini_model') || 'gemini-2.5-flash';
      case 'deepseek':
        return localStorage.getItem('deepseek_model') || 'deepseek-chat';
      case 'openai':
        return localStorage.getItem('openai_model') || 'gpt-4o-mini';
      default:
        return '';
    }
  } catch {
    return '';
  }
}

export function setProviderModel(providerId, modelId) {
  try {
    if (modelId) localStorage.setItem(`${providerId}_model`, modelId);
  } catch {
    // ignore
  }
}

// In-Memory Fast L1 Cache (0ms)
const memCache = new Map();

function loadPersistentCache() {
  try {
    const raw = localStorage.getItem(CACHE_STORAGE);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      Object.entries(parsed).forEach(([k, v]) => {
        if (typeof v === 'string') memCache.set(k, v);
      });
    }
  } catch {
    // ignore
  }
}

function savePersistentCache(key, value) {
  try {
    memCache.set(key, value);
    const raw = localStorage.getItem(CACHE_STORAGE);
    let obj = raw ? JSON.parse(raw) : {};
    obj[key] = value;
    const keys = Object.keys(obj);
    if (keys.length > MAX_LOCAL_CACHE) {
      const trimmed = {};
      keys.slice(-MAX_LOCAL_CACHE).forEach((k) => {
        trimmed[k] = obj[k];
      });
      obj = trimmed;
    }
    localStorage.setItem(CACHE_STORAGE, JSON.stringify(obj));
  } catch {
    // ignore
  }
}

loadPersistentCache();

/**
 * Fast synchronous lookup in L1/L2 cache and local SLM lexicon (0ms instant response)
 */
export function getCachedTranslation(text, targetLang) {
  if (!text || !targetLang) return null;
  const normText = text.trim();
  if (!normText || isNonTranslatable(normText)) return normText;

  const cacheKey = `${targetLang}::${normText}`;
  if (memCache.has(cacheKey)) return memCache.get(cacheKey);

  // Check Local SLM Lexicon
  const { prefix, core, suffix } = extractPunctuationWrapper(normText);
  if (core && SLM_DICTIONARY[core] && SLM_DICTIONARY[core][targetLang]) {
    const translatedCore = SLM_DICTIONARY[core][targetLang];
    const fullTranslation = formatPreservedText(translatedCore, prefix, suffix, core);
    savePersistentCache(cacheKey, fullTranslation);
    return fullTranslation;
  }

  return null;
}

// --- Tier 2: Server-Side Gemini Flash SLM ---
async function translateViaServerSLM(text, targetLang) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const resp = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        text,
        targetLang,
      }),
    });

    clearTimeout(timeout);
    if (resp.ok) {
      const data = await resp.json();
      if (data.translatedText) {
        return {
          translatedText: data.translatedText,
          tier: 'gemini-flash-slm',
          provider: data.provider || 'gemini-3.7-flash',
        };
      }
    }
  } catch {
    clearTimeout(timeout);
  }
  return null;
}

// --- Tier 3: Zero-Key Web Fallback ---
async function translateViaWebFallback(text, targetLang) {
  let targetCode = targetLang;
  if (targetLang === 'hinglish') targetCode = 'hi';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=autodetect|${targetCode}`;
    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (resp.ok) {
      const data = await resp.json();
      const translated = data?.responseData?.translatedText;
      if (translated && !translated.startsWith('MYMEMORY WARNING')) {
        return {
          translatedText: translated,
          tier: 'web-fallback',
          provider: 'mymemory',
        };
      }
    }
  } catch {
    clearTimeout(timeout);
  }
  return null;
}

// --- Tier 4: Custom API Keys (OpenRouter / Gemini / DeepSeek / OpenAI) ---
async function translateViaCustomProvider(provider, text, targetLang, apiKey, modelId) {
  const targetLabel = LANGUAGE_MAP[targetLang] || targetLang;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    if (provider === 'openrouter') {
      const model = modelId || getProviderModel('openrouter') || 'google/gemini-2.0-flash-exp:free';
      const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: `Translate the chat message into ${targetLabel}. Output ONLY the raw translated text.`,
            },
            { role: 'user', content: text },
          ],
          temperature: 0.1,
          max_tokens: 256,
        }),
      });
      clearTimeout(timeout);
      if (resp.ok) {
        const data = await resp.json();
        const content = data?.choices?.[0]?.message?.content?.trim();
        if (content) return { translatedText: content, tier: 'custom-openrouter', provider: model };
      }
    } else if (provider === 'gemini') {
      const model = modelId || getProviderModel('gemini') || 'gemini-2.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Translate into ${targetLabel}. Output strictly the translation:\n${text}` }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 256 },
        }),
      });
      clearTimeout(timeout);
      if (resp.ok) {
        const data = await resp.json();
        const content = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (content) return { translatedText: content, tier: 'custom-gemini', provider: model };
      }
    } else if (provider === 'deepseek') {
      const model = modelId || getProviderModel('deepseek') || 'deepseek-chat';
      const resp = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: `Translate into ${targetLabel}. Return only translation.` },
            { role: 'user', content: text },
          ],
          temperature: 0.1,
          max_tokens: 256,
        }),
      });
      clearTimeout(timeout);
      if (resp.ok) {
        const data = await resp.json();
        const content = data?.choices?.[0]?.message?.content?.trim();
        if (content) return { translatedText: content, tier: 'custom-deepseek', provider: model };
      }
    } else if (provider === 'openai') {
      const model = modelId || getProviderModel('openai') || 'gpt-4o-mini';
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: `Translate directly into ${targetLabel}. Return only translation.` },
            { role: 'user', content: text },
          ],
          temperature: 0.1,
          max_tokens: 256,
        }),
      });
      clearTimeout(timeout);
      if (resp.ok) {
        const data = await resp.json();
        const content = data?.choices?.[0]?.message?.content?.trim();
        if (content) return { translatedText: content, tier: 'custom-openai', provider: model };
      }
    }
  } catch {
    clearTimeout(timeout);
  }
  return null;
}

// In-Flight Request Deduplication Map
const inflightRequests = new Map();

/**
 * Main Translation Method
 * Returns string translation, or rich telemetry object if requested
 */
export async function translateText(text, targetLang, customProvider = null, returnDetails = false) {
  if (!text || !targetLang) return returnDetails ? { translatedText: text, latencyMs: 0, tier: 'noop' } : text;
  const normText = text.trim();
  if (!normText) return returnDetails ? { translatedText: text, latencyMs: 0, tier: 'noop' } : text;

  if (isNonTranslatable(normText)) {
    return returnDetails ? { translatedText: normText, latencyMs: 0, tier: 'non-translatable' } : normText;
  }

  const startTime = performance.now();

  // Tier 0 & Tier 1: Check instant cache & SLM dictionary (0ms)
  const cached = getCachedTranslation(normText, targetLang);
  if (cached) {
    const latency = Math.round(performance.now() - startTime);
    return returnDetails
      ? { translatedText: cached, latencyMs: latency, tier: 'instant-slm-cache', provider: 'local-lexicon' }
      : cached;
  }

  const provider = customProvider || getActiveProvider();
  const inFlightKey = `${provider}::${targetLang}::${normText}`;

  if (inflightRequests.has(inFlightKey)) {
    const res = await inflightRequests.get(inFlightKey);
    const latency = Math.round(performance.now() - startTime);
    return returnDetails ? { ...res, latencyMs: latency } : res.translatedText;
  }

  const task = (async () => {
    let result = null;
    const apiKey = getProviderApiKey(provider);
    const model = getProviderModel(provider);

    // If user has chosen a custom third-party key provider
    if (provider !== 'whisper_slm' && provider !== 'builtin' && apiKey) {
      result = await translateViaCustomProvider(provider, normText, targetLang, apiKey, model);
    }

    // Default primary SLM tier: Server-side Gemini 3.7 Flash SLM
    if (!result) {
      result = await translateViaServerSLM(normText, targetLang);
    }

    // Failover tier: Free Web Service
    if (!result) {
      result = await translateViaWebFallback(normText, targetLang);
    }

    if (result && result.translatedText) {
      savePersistentCache(`${targetLang}::${normText}`, result.translatedText);
      return result;
    }

    return {
      translatedText: normText,
      tier: 'fallback-original',
      provider: 'none',
    };
  })().finally(() => {
    inflightRequests.delete(inFlightKey);
  });

  inflightRequests.set(inFlightKey, task);
  const finalResult = await task;
  const latency = Math.round(performance.now() - startTime);

  return returnDetails
    ? { ...finalResult, latencyMs: latency }
    : finalResult.translatedText;
}

/**
 * Batch translation helper: Translates multiple messages in 1 roundtrip
 */
export async function translateBatch(items, targetLang) {
  if (!Array.isArray(items) || items.length === 0 || !targetLang) return [];

  // 1. Separate items that are already cached or non-translatable
  const missing = [];
  const results = new Array(items.length);

  items.forEach((item, index) => {
    const t = typeof item === 'string' ? item : item.content || item.text || '';
    const norm = t.trim();
    if (!norm || isNonTranslatable(norm)) {
      results[index] = norm;
      return;
    }

    const cached = getCachedTranslation(norm, targetLang);
    if (cached) {
      results[index] = cached;
    } else {
      missing.push({ index, text: norm });
    }
  });

  if (missing.length === 0) {
    return results;
  }

  // 2. Call server batch SLM endpoint for remaining items
  try {
    const resp = await fetch('/api/translate/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: missing.map((m) => m.text),
        targetLang,
      }),
    });

    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data.translations)) {
        data.translations.forEach((trans, idx) => {
          const original = missing[idx];
          if (original) {
            results[original.index] = trans;
            savePersistentCache(`${targetLang}::${original.text}`, trans);
          }
        });
        return results;
      }
    }
  } catch {
    // ignore
  }

  // 3. Fallback to individual parallel translates if batch failed
  await Promise.all(
    missing.map(async ({ index, text }) => {
      results[index] = await translateText(text, targetLang);
    })
  );

  return results;
}

/**
 * Background prefetch helper
 */
export function prefetchTranslation(text, targetLang) {
  if (!text || !targetLang) return;
  const cached = getCachedTranslation(text, targetLang);
  if (cached) return;
  translateText(text, targetLang).catch(() => {});
}
