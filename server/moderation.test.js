import test from 'node:test';
import assert from 'node:assert/strict';
import { createModerationService, normalizeForModeration } from './moderation.js';

test('sanitizes valid structured moderation output', async () => {
  const service = createModerationService({
    provider: async () => ({
      decision: 'block',
      riskLevel: 'critical',
      categories: ['cyber_abuse_or_exploitation', 'unknown_category'],
      confidence: 4,
      reasonCode: 'synthetic fixture!',
      secret: 'must be discarded',
    }),
  });
  assert.deepEqual(await service.classify('synthetic content'), {
    decision: 'block',
    riskLevel: 'critical',
    categories: ['cyber_abuse_or_exploitation'],
    confidence: 1,
    reasonCode: 'synthetic_fixture_',
  });
});

test('removes zero-width characters before moderation classification', async () => {
  let received;
  const service = createModerationService({
    provider: async ({ text }) => {
      received = text;
      return { decision: text.includes('IGNORE_POLICY') ? 'review' : 'allow', riskLevel: 'medium', categories: ['policy_evasion'], confidence: 0.9, reasonCode: 'zero_width_fixture' };
    },
  });
  const input = 'IGNORE_' + String.fromCharCode(0x200b) + 'POLICY';
  const result = await service.classify(input);
  assert.equal(received, 'IGNORE_POLICY');
  assert.equal(result.decision, 'review');
  assert.equal(normalizeForModeration(input).includes(String.fromCharCode(0x200b)), false);
});

test('maps common Cyrillic homoglyphs to a moderation skeleton', async () => {
  let received;
  const service = createModerationService({
    provider: async ({ text }) => {
      received = text;
      return { decision: text.includes('hack') ? 'block' : 'allow', riskLevel: 'high', categories: ['cyber_abuse_or_exploitation'], confidence: 0.95, reasonCode: 'homoglyph_fixture' };
    },
  });
  const result = await service.classify('hаck');
  assert.equal(received, 'hack');
  assert.equal(result.decision, 'block');
});

test('does not implicitly allow malformed provider output', async () => {
  const service = createModerationService({ provider: async () => ({ decision: 'allow' }) });
  const result = await service.classify('synthetic content');
  assert.equal(result.decision, 'review');
  assert.equal(result.reasonCode, 'moderation_unavailable');
});

test('uses block fail mode on provider failure', async () => {
  const service = createModerationService({
    failMode: 'block',
    provider: async () => { throw new Error('provider secret should not leak'); },
  });
  const result = await service.classify('synthetic content');
  assert.equal(result.decision, 'block');
  assert.equal(result.riskLevel, 'high');
  assert.equal(result.reasonCode, 'moderation_provider_error');
});

test('turns timeout into review without leaking provider error', async () => {
  const service = createModerationService({
    timeoutMs: 5,
    provider: ({ signal }) => new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => reject(new Error('timeout secret')));
    }),
  });
  const result = await service.classify('synthetic content');
  assert.deepEqual(result, {
    decision: 'review',
    riskLevel: 'medium',
    categories: [],
    confidence: 0,
    reasonCode: 'moderation_unavailable',
  });
});
