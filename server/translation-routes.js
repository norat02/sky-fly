import express from 'express';
import { isModerationAllowed, isModerationBlocked } from './moderation.js';

export const LANGUAGE_NAMES = Object.freeze({
  en: 'English', es: 'Spanish', hi: 'Hindi', hinglish: 'Hinglish', fr: 'French', de: 'German', ja: 'Japanese', zh: 'Chinese (Simplified)', 'zh-TW': 'Chinese (Traditional)', ko: 'Korean', pt: 'Portuguese', ru: 'Russian', ar: 'Arabic', it: 'Italian', tr: 'Turkish', vi: 'Vietnamese', id: 'Indonesian', bn: 'Bengali', ur: 'Urdu', ta: 'Tamil', te: 'Telugu', mr: 'Marathi', nl: 'Dutch', pl: 'Polish', th: 'Thai', fa: 'Persian', sv: 'Swedish', uk: 'Ukrainian', tl: 'Filipino', ms: 'Malay', he: 'Hebrew', el: 'Greek', cs: 'Czech', ro: 'Romanian', hu: 'Hungarian', da: 'Danish', no: 'Norwegian', fi: 'Finnish',
});

function reject(res, status, error, code) {
  return res.status(status).json({ error, code, translationPending: true });
}

function itemText(item) {
  return typeof item === 'string' ? item : item && typeof item.text === 'string' ? item.text : null;
}

export function registerTranslationRoutes(app, { authMiddleware, moderationService, getAiClient, recordModerationEvent }) {
  const router = express.Router();
  router.use(authMiddleware);

  router.post('/', async (req, res) => {
    try {
      const { text, targetLang = 'en', sourceLang = 'auto' } = req.body || {};
      if (typeof text !== 'string') return res.status(400).json({ error: 'Text parameter is required' });
      if (text.length > 8000) return res.status(413).json({ error: 'Text exceeds content limits' });
      if (!LANGUAGE_NAMES[targetLang]) return res.status(400).json({ error: 'Unsupported target language' });
      const trimmed = text.trim();
      if (!trimmed) return res.json({ translatedText: text, provider: 'slm-noop' });

      const moderation = await moderationService.classify(trimmed, { targetLang });
      if (!isModerationAllowed(moderation)) {
        await recordModerationEvent?.({ req, content: trimmed, moderation, targetLang });
        return reject(res, isModerationBlocked(moderation) ? 403 : 202,
          isModerationBlocked(moderation) ? 'Content blocked by community safety policy.' : 'Content is pending safety review.',
          isModerationBlocked(moderation) ? 'CONTENT_MODERATION_BLOCKED' : 'CONTENT_MODERATION_REVIEW');
      }

      const ai = getAiClient();
      if (!ai) return res.status(503).json({ error: 'Translation provider unavailable', fallbackNeeded: true });
      const response = await ai.translate({ text: trimmed, targetLang, sourceLang, targetLangName: LANGUAGE_NAMES[targetLang] });
      return res.json({ translatedText: String(response || trimmed), targetLang, sourceLang, provider: 'gemini-3.7-flash-slm' });
    } catch (error) {
      return res.status(500).json({ error: 'Translation failed', fallbackNeeded: true });
    }
  });

  router.post('/batch', async (req, res) => {
    try {
      const { items, targetLang = 'en' } = req.body || {};
      if (!Array.isArray(items) || items.length === 0 || items.length > 50) return res.status(400).json({ error: 'items array is required and must contain 1-50 items' });
      if (!LANGUAGE_NAMES[targetLang]) return res.status(400).json({ error: 'Unsupported target language' });
      const texts = items.map(itemText);
      if (texts.some((text) => !text || text.length > 8000) || texts.join('').length > 30000) return res.status(413).json({ error: 'Batch content exceeds limits' });

      const moderationResults = await Promise.all(texts.map((text) => moderationService.classify(text, { targetLang })));
      const unsafeIndexes = moderationResults.map((result, index) => isModerationAllowed(result) ? -1 : index).filter((index) => index >= 0);
      if (unsafeIndexes.length) {
        await Promise.all(unsafeIndexes.map((index) => recordModerationEvent?.({ req, content: texts[index], moderation: moderationResults[index], targetLang })));
        const blocked = unsafeIndexes.some((index) => isModerationBlocked(moderationResults[index]));
        return res.status(blocked ? 403 : 202).json({
          error: blocked ? 'Content blocked by community safety policy.' : 'Content is pending safety review.',
          code: blocked ? 'CONTENT_MODERATION_BLOCKED' : 'CONTENT_MODERATION_REVIEW', unsafeIndexes, translationPending: true,
        });
      }

      const ai = getAiClient();
      if (!ai) return res.status(503).json({ error: 'Translation provider unavailable', fallbackNeeded: true });
      const translations = await ai.translateBatch({ texts, targetLang, targetLangName: LANGUAGE_NAMES[targetLang] });
      return res.json({ translations: Array.isArray(translations) ? translations.map(String) : texts, targetLang, provider: 'gemini-3.7-flash-slm-batch' });
    } catch {
      return res.status(500).json({ error: 'Batch translation failed', fallbackNeeded: true });
    }
  });

  app.use('/api/translate', router);
}
