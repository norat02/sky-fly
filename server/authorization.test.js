import test from 'node:test';
import assert from 'node:assert/strict';
import {
  rejectClientAuthorizationFields,
  requireOwnership,
  requirePermission,
} from './authorization.js';

function response() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
}

test('rejects client-controlled authorization fields', () => {
  const req = { body: { text: 'hello', role: 'admin' } };
  const res = response();
  let called = false;
  rejectClientAuthorizationFields(req, res, () => { called = true; });
  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, { error: 'Authorization fields are server-controlled.' });
  assert.equal(called, false);
});

test('returns 401 when permission middleware has no verified user', async () => {
  const res = response();
  let called = false;
  await requirePermission('translation:use')({}, res, () => { called = true; });
  assert.equal(res.statusCode, 401);
  assert.equal(called, false);
});

test('evaluates permission from server-side profile, not request body', async () => {
  const req = {
    body: { permission: 'admin:*' },
    auth: {
      user: { id: 'u1' },
      supabase: {
        from() {
          return {
            select() { return this; },
            eq() { return this; },
            async maybeSingle() { return { data: { id: 'u1', role: 'user' }, error: null }; },
          };
        },
      },
    },
  };
  const res = response();
  let called = false;
  await requirePermission('translation:use')(req, res, () => { called = true; });
  assert.equal(res.statusCode, 200);
  assert.equal(called, true);
});

test('denies ownership mismatch using verified user id', async () => {
  const req = { auth: { user: { id: 'u1' } } };
  const res = response();
  let called = false;
  await requireOwnership(async () => 'u2')(req, res, () => { called = true; });
  assert.equal(res.statusCode, 403);
  assert.equal(called, false);
});
