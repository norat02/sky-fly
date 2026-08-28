import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// Lazy-initialize Google GenAI client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  hi: 'Hindi',
  hinglish: 'Hinglish (Hindi written in Roman/English script for texting and casual chatting)',
  fr: 'French',
  de: 'German',
  ja: 'Japanese',
  'zh': 'Chinese (Simplified)',
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

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // 1. SLM Translation Engine Status
  app.get('/api/slm/status', (req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY);
    res.json({
      status: 'online',
      engine: 'Whisper SLM Translation Engine',
      model: 'gemini-3.7-flash',
      capabilities: ['single_translate', 'batch_translate', 'slang_idiom_normalization', 'zero_delay_cache'],
      hasServerKey: hasKey,
      supportedLanguages: Object.keys(LANGUAGE_NAMES),
    });
  });

  // 2. Single Message Translation API (SLM)
  app.post('/api/translate', async (req, res) => {
    try {
      const { text, targetLang = 'en', sourceLang = 'auto' } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text parameter is required' });
      }

      const trimmed = text.trim();
      if (!trimmed) {
        return res.json({ translatedText: text, provider: 'slm-noop' });
      }

      const targetLangName = LANGUAGE_NAMES[targetLang] || targetLang;
      const ai = getAiClient();

      if (!ai) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY is not configured on server',
          fallbackNeeded: true,
        });
      }

      const prompt = `Translate this chat message into ${targetLangName}:\n${trimmed}`;
      const systemInstruction = `You are Whisper SLM, a specialized Small Language Model built for conversational chat translation.
Translate the chat message directly into ${targetLangName}.
Output ONLY the translated text. Never add quotes, labels, prefixes, explanations, or notes.
Preserve emojis, @mentions, URLs, and punctuation. Maintain texting nuance and natural casual tone.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.1,
          maxOutputTokens: Math.max(64, Math.min(300, trimmed.length * 3)),
        },
      });

      let translated = response.text?.trim() || '';
      if ((translated.startsWith('"') && translated.endsWith('"')) || (translated.startsWith("'") && translated.endsWith("'"))) {
        translated = translated.slice(1, -1).trim();
      }

      return res.json({
        translatedText: translated || trimmed,
        targetLang,
        sourceLang,
        provider: 'gemini-3.7-flash-slm',
      });
    } catch (err: any) {
      console.error('SLM Translation error:', err?.message || err);
      return res.status(500).json({
        error: err?.message || 'Translation failed',
        fallbackNeeded: true,
      });
    }
  });

  // 3. Batch Messages Translation API (Ultra-Fast Parallel SLM)
  app.post('/api/translate/batch', async (req, res) => {
    try {
      const { items, targetLang = 'en' } = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'items array is required' });
      }

      const ai = getAiClient();
      if (!ai) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY is not configured on server',
          fallbackNeeded: true,
        });
      }

      const targetLangName = LANGUAGE_NAMES[targetLang] || targetLang;

      // Translate in a single structured prompt for maximum speed & lowest latency
      const numberedList = items
        .map((item: any, idx: number) => `[${idx + 1}] ${typeof item === 'string' ? item : item.text}`)
        .join('\n');

      const systemInstruction = `You are Whisper SLM, a high-speed batch translation model for chat streams.
Translate each numbered line into ${targetLangName}.
Output lines in the EXACT same format: [1] <translation>, [2] <translation>, etc.
Preserve emojis, @mentions, and URLs. Output only the numbered list.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: numberedList,
        config: {
          systemInstruction,
          temperature: 0.1,
          maxOutputTokens: 1000,
        },
      });

      const rawLines = (response.text || '').split('\n').filter(Boolean);
      const results: string[] = [];

      for (let i = 0; i < items.length; i++) {
        const expectedPrefix = `[${i + 1}]`;
        const line = rawLines.find((l) => l.trim().startsWith(expectedPrefix));
        if (line) {
          let cleaned = line.replace(new RegExp(`^\\[${i + 1}\\]\\s*`), '').trim();
          if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
            cleaned = cleaned.slice(1, -1).trim();
          }
          results.push(cleaned);
        } else {
          const original = typeof items[i] === 'string' ? items[i] : items[i].text;
          results.push(original);
        }
      }

      return res.json({
        translations: results,
        targetLang,
        provider: 'gemini-3.7-flash-slm-batch',
      });
    } catch (err: any) {
      console.error('SLM Batch Translation error:', err?.message || err);
      return res.status(500).json({
        error: err?.message || 'Batch translation failed',
        fallbackNeeded: true,
      });
    }
  });

  // Vite middleware in development vs static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Whisper SLM server listening on port ${PORT}`);
  });
}

startServer();
