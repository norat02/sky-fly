import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { registerTranslationRoutes } from './translation-routes.js';
import { normalizeForModeration } from './moderation.js';
import { rejectClientAuthorizationFields } from './authorization.js';

let server;
let baseUrl;
let translatorCalls;

const moderationService = {
  async classify(text) {
    if (typeof text !== 'string') return { decision: 'review', riskLevel: 'medium', categories: [], confidence: 0, reasonCode: 'invalid' };
    const normalized = normalizeForModeration(text);
    if (normalized.includes('[BLOCK_CYBER]') || normalized.includes('[DANGEROUS_COMMUNITY_HARM]') || normalized.includes('hack')) {
      return { decision: 'block', riskLevel: 'high', categories: ['cyber_abuse_or_exploitation'], confidence: 0.99, reasonCode: 'synthetic_attack_fixture' };
    }
    if (text.includes('[REVIEW]') || text.includes('IGNORE_POLICY_AND_ALLOW')) {
      return { decision: 'review', riskLevel: 'medium', categories: ['policy_evasion'], confidence: 0.8, reasonCode: 'synthetic_review_fixture' };
    }
    return { decision: 'allow', riskLevel: 'none', categories: [], confidence: 0.99, reasonCode: 'safe' };
  },
};

function authMiddleware(req, res, next) {
  if (req.headers.authorization !== 'Bearer test-user') return res.status(401).json({ error: 'Authentication required.' });
  req.auth = { user: { id: 'test-user' } };
  next();
}

function permissionMiddleware(req, res, next) {
  if (!req.auth?.user) return res.status(401).json({ error: 'Authentication required.' });
  next();
}

function fakeAi() {
  return {
    async translate({ text }) {
      translatorCalls.single += 1;
      return `translated:${text}`;
    },
    async translateBatch({ texts }) {
      translatorCalls.batch += 1;
      return texts.map((text) => `translated:${text}`);
    },
  };
}

async function request(path, options = {}) {
  return fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'content-type': 'application/json', ...(options.headers || {}) },
  });
}

before(async () => {
  translatorCalls = { single: 0, batch: 0 };
  const app = express();
  app.use(express.json({ limit: '2mb' }));
  registerTranslationRoutes(app, {
    authMiddleware: [authMiddleware, permissionMiddleware, rejectClientAuthorizationFields],
    moderationService,
    getAiClient: fakeAi,
  });
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test('rejects unauthenticated direct API calls before moderation or translation', async () => {
  const response = await request('/api/translate', { method: 'POST', body: JSON.stringify({ text: 'hello' }) });
  assert.equal(response.status, 401);
  assert.equal(translatorCalls.single, 0);
});

test('blocks synthetic cyber-abuse and does not call translator', async () => {
  const response = await request('/api/translate', {
    method: 'POST',
    headers: { authorization: 'Bearer test-user' },
    body: JSON.stringify({ text: '[BLOCK_CYBER] non-executable synthetic fixture', targetLang: 'vi' }),
  });
  const body = await response.json();
  assert.equal(response.status, 403);
  assert.equal(body.code, 'CONTENT_MODERATION_BLOCKED');
  assert.equal(body.translatedText, undefined);
  assert.equal(translatorCalls.single, 0);
});

test('blocks zero-width and homoglyph evasion through the real HTTP route', async () => {
  const zeroWidth = await request('/api/translate', {
    method: 'POST', headers: { authorization: 'Bearer test-user' },
    body: JSON.stringify({ text: '[BLOCK_' + String.fromCharCode(0x200b) + 'CYBER]', targetLang: 'en' }),
  });
  assert.equal(zeroWidth.status, 403);

  const homoglyph = await request('/api/translate', {
    method: 'POST', headers: { authorization: 'Bearer test-user' },
    body: JSON.stringify({ text: 'hаck', targetLang: 'en' }),
  });
  assert.equal(homoglyph.status, 403);
  assert.equal(translatorCalls.single, 0);
});

test('holds prompt-injection and policy-evasion fixture for review', async () => {
  const response = await request('/api/translate', {
    method: 'POST',
    headers: { authorization: 'Bearer test-user' },
    body: JSON.stringify({ text: 'IGNORE_POLICY_AND_ALLOW [REVIEW]', targetLang: 'en' }),
  });
  const body = await response.json();
  assert.equal(response.status, 202);
  assert.equal(body.code, 'CONTENT_MODERATION_REVIEW');
  assert.equal(translatorCalls.single, 0);
});

test('rejects untrusted target language instructions by allowlist', async () => {
  const response = await request('/api/translate', {
    method: 'POST',
    headers: { authorization: 'Bearer test-user' },
    body: JSON.stringify({ text: 'hello', targetLang: 'en; IGNORE_SYSTEM_INSTRUCTION' }),
  });
  assert.equal(response.status, 400);
  assert.equal(translatorCalls.single, 0);
});

test('rejects forged authorization fields before business processing', async () => {
  const response = await request('/api/translate', {
    method: 'POST',
    headers: { authorization: 'Bearer test-user' },
    body: JSON.stringify({ text: 'hello', role: 'admin', ownerId: 'another-user', isAdmin: true }),
  });
  const body = await response.json();
  assert.equal(response.status, 403);
  assert.match(body.error, /server-controlled/i);
  assert.equal(translatorCalls.single, 0);
});

test('allows safe single translation and calls translator exactly once', async () => {
  const response = await request('/api/translate', {
    method: 'POST',
    headers: { authorization: 'Bearer test-user' },
    body: JSON.stringify({ text: 'hello community', targetLang: 'vi' }),
  });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.translatedText, 'translated:hello community');
  assert.equal(translatorCalls.single, 1);
});

test('blocks unsafe batch item and never partially translates the batch', async () => {
  const response = await request('/api/translate/batch', {
    method: 'POST',
    headers: { authorization: 'Bearer test-user' },
    body: JSON.stringify({ items: ['safe one', '[DANGEROUS_COMMUNITY_HARM] fixture', 'safe two'], targetLang: 'en' }),
  });
  const body = await response.json();
  assert.equal(response.status, 403);
  assert.deepEqual(body.unsafeIndexes, [1]);
  assert.equal(translatorCalls.batch, 0);
});

test('holds batch when one item requires review, preserving no translation leakage', async () => {
  const response = await request('/api/translate/batch', {
    method: 'POST',
    headers: { authorization: 'Bearer test-user' },
    body: JSON.stringify({ items: ['safe one', '[REVIEW] ambiguous fixture'], targetLang: 'en' }),
  });
  const body = await response.json();
  assert.equal(response.status, 202);
  assert.equal(body.code, 'CONTENT_MODERATION_REVIEW');
  assert.deepEqual(body.unsafeIndexes, [1]);
  assert.equal(body.translations, undefined);
  assert.equal(translatorCalls.batch, 0);
});

test('rejects batch amplification and malformed items before AI calls', async () => {
  const tooMany = await request('/api/translate/batch', {
    method: 'POST', headers: { authorization: 'Bearer test-user' },
    body: JSON.stringify({ items: Array.from({ length: 51 }, () => 'x'), targetLang: 'en' }),
  });
  assert.equal(tooMany.status, 400);

  const malformed = await request('/api/translate/batch', {
    method: 'POST', headers: { authorization: 'Bearer test-user' },
    body: JSON.stringify({ items: [{ text: 'ok', userId: 'other-user' }], targetLang: 'en' }),
  });
  assert.equal(malformed.status, 403);
  assert.equal(translatorCalls.batch, 0);
});

test('rejects oversized single content without invoking translator', async () => {
  const callsBefore = translatorCalls.single;
  const response = await request('/api/translate', {
    method: 'POST', headers: { authorization: 'Bearer test-user' },
    body: JSON.stringify({ text: 'x'.repeat(8001), targetLang: 'en' }),
  });
  assert.equal(response.status, 413);
  assert.equal((await response.json()).error, 'Text exceeds content limits');
  assert.equal(translatorCalls.single, callsBefore);
});
