import express from 'express';
import { rejectClientAuthorizationFields, requireRole } from './authorization.js';

const router = express.Router();
const DECISIONS = new Set(['approve', 'reject']);

function genericError(res, status = 503) {
  return res.status(status).json({ error: status === 403 ? 'Forbidden.' : 'Moderation service unavailable.' });
}

export function registerAdminModerationRoutes(app, { authMiddleware }) {
  router.use(authMiddleware, requireRole('admin'), rejectClientAuthorizationFields);

  router.get('/queue', async (req, res) => {
    const { data, error } = await req.auth.supabase
      .from('moderation_events')
      .select('id, content, decision, risk_level, categories, confidence, reason_code, status, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) return genericError(res);
    return res.json({ items: data || [] });
  });

  router.patch('/queue/:id', async (req, res) => {
    const { decision, note } = req.body || {};
    if (!DECISIONS.has(decision) || (note !== undefined && typeof note !== 'string')) {
      return res.status(400).json({ error: 'Invalid moderation decision.' });
    }
    const { data, error } = await req.auth.supabase
      .from('moderation_events')
      .update({
        status: 'resolved',
        decision,
        reviewer_note: note?.slice(0, 1000) || null,
        reviewed_by: req.auth.user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .eq('status', 'pending')
      .select('id, decision, status, reviewed_at')
      .maybeSingle();
    if (error) return genericError(res);
    if (!data) return res.status(404).json({ error: 'Moderation item not found.' });
    return res.json({ item: data });
  });

  app.use('/api/admin/moderation', router);
}
