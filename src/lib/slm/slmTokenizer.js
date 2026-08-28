// Whisper SLM Tokenizer & Entity Protection Engine

const URL_REGEX = /(https?:\/\/[^\s]+)/gi;
const MENTION_REGEX = /(@[a-zA-Z0-9_-]+)/g;
const EMOJI_REGEX = /([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F1E6}-\u{1F1FF}])/gu;

export function sanitizeText(text) {
  if (!text) return '';
  return String(text).trim();
}

/**
 * Normalizes a sentence for lexicon lookup:
 * Extracts punctuation like '!', '?', '.', '...' and returns both clean word and punctuation wrapper
 */
export function extractPunctuationWrapper(text) {
  const trimmed = text.trim();
  const match = trimmed.match(/^([^a-zA-Z0-9\u00C0-\u024F\u0400-\u04FF\u0600-\u06FF\u0900-\u097F\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF]*)(.*?)([^a-zA-Z0-9\u00C0-\u024F\u0400-\u04FF\u0600-\u06FF\u0900-\u097F\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF]*)$/u);

  if (!match) {
    return {
      prefix: '',
      core: trimmed.toLowerCase(),
      suffix: '',
    };
  }

  return {
    prefix: match[1] || '',
    core: (match[2] || '').toLowerCase(),
    suffix: match[3] || '',
  };
}

/**
 * Re-applies original casing and punctuation
 */
export function formatPreservedText(translatedCore, prefix, suffix, originalCore) {
  if (!translatedCore) return '';
  let result = translatedCore;

  // If original was ALL CAPS and longer than 1 letter, uppercase the translation
  if (originalCore && originalCore.length > 1 && originalCore === originalCore.toUpperCase() && /[A-Z]/.test(originalCore)) {
    result = result.toUpperCase();
  }

  return `${prefix}${result}${suffix}`.trim();
}

/**
 * Checks if the string contains only emojis, numbers, or urls (no actual words to translate)
 */
export function isNonTranslatable(text) {
  if (!text || !text.trim()) return true;
  const t = text.trim();

  // Pure URL
  if (/^https?:\/\/[^\s]+$/i.test(t)) return true;

  // Pure Number or calculation
  if (/^[\d\s+\-*/%=.,$€£¥₹()]+$/.test(t)) return true;

  // Pure emojis
  const withoutEmojis = t.replace(EMOJI_REGEX, '').trim();
  if (withoutEmojis.length === 0) return true;

  return false;
}
