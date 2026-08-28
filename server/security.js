import { createClient } from '@supabase/supabase-js';

const buckets = new Map();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;

function clientKey(req) {
  const forwarded = req.headers['x-forwarded-for'];
  return String(forwarded || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
}

function auditAuthEvent(req, event, extra = {}) {
  console.warn('[auth-audit]', JSON.stringify({
    event,
    method: req.method,
    path: `${req.baseUrl || ''}${req.path || ''}` || '/',
    ip: clientKey(req),
    at: new Date().toISOString(),
    ...extra,
  }));
}

export function securityHeaders(_req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
}

export function apiRateLimit(req, res, next) {
  const now = Date.now();
  const key = clientKey(req);
  const current = buckets.get(key) || { count: 0, startedAt: now };
  if (now - current.startedAt >= WINDOW_MS) {
    current.count = 0;
    current.startedAt = now;
  }
  current.count += 1;
  buckets.set(key, current);
  if (current.count > MAX_REQUESTS) {
    auditAuthEvent(req, 'rate_limit_exceeded');
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }
  return next();
}

function bearerToken(req) {
  const header = req.headers.authorization;
  if (!header || !/^Bearer\s+[^\s]+$/i.test(header)) return null;
  return header.replace(/^Bearer\s+/i, '').trim();
}

export async function requireSupabaseUser(req, res, next) {
  const token = bearerToken(req);
  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!token || !url || !anonKey) {
    auditAuthEvent(req, 'missing_authentication');
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const supabase = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      auditAuthEvent(req, 'invalid_authentication');
      return res.status(401).json({ error: 'Authentication required.' });
    }
    req.authUser = data.user;
    return next();
  } catch {
    auditAuthEvent(req, 'authentication_verification_failed');
    return res.status(401).json({ error: 'Authentication required.' });
  }
}

export function redactError(error) {
  const message = String(error?.message || 'Request failed');
  return message
    .replace(/Bearer\s+\S+/gi, 'Bearer [redacted]')
    .replace(/(api[_-]?key|secret|token|password)\s*[:=]\s*[^\s,;]+/gi, '$1=[redacted]');
}
