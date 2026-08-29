import test from 'node:test';
import assert from 'node:assert/strict';
import { detectPreferredLanguage } from './languages.js';

test('maps browser locale to supported Whisper language', () => {
  assert.equal(detectPreferredLanguage(['vi-VN', 'en-US']), 'vi');
  assert.equal(detectPreferredLanguage(['ar-SA', 'en-US']), 'ar');
  assert.equal(detectPreferredLanguage(['zh-TW', 'en-US']), 'zh-TW');
});

test('uses ordered locale candidates and safe English fallback', () => {
  assert.equal(detectPreferredLanguage(['xx-YY', 'fr-FR']), 'fr');
  assert.equal(detectPreferredLanguage(['xx-YY']), 'en');
});
