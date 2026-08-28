const ROLE_PERMISSIONS = Object.freeze({
  user: new Set(['profile:read:self', 'profile:update:self', 'chat:read', 'chat:write', 'media:upload:self', 'translation:use']),
  member: new Set(['profile:read:self', 'profile:update:self', 'chat:read', 'chat:write', 'media:upload:self', 'translation:use']),
  moderator: new Set(['profile:read:self', 'profile:update:self', 'chat:read', 'chat:write', 'media:upload:self', 'translation:use', 'content:moderate']),
  developer: new Set(['profile:read:self', 'profile:update:self', 'chat:read', 'chat:write', 'media:upload:self', 'translation:use', 'developer:manage']),
  admin: new Set(['*']),
});

function deny(res, status, message) {
  return res.status(status).json({ error: message });
}

function roleFromProfile(profile) {
  const role = String(profile?.role || 'user').toLowerCase();
  return Object.prototype.hasOwnProperty.call(ROLE_PERMISSIONS, role) ? role : 'user';
}

async function getServerProfile(req) {
  if (req.auth?.profile) return req.auth.profile;
  const user = req.auth?.user;
  const supabase = req.auth?.supabase;
  if (!user || !supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, role, username')
    .eq('id', user.id)
    .maybeSingle();
  if (error) return null;
  req.auth.profile = data || { id: user.id, role: 'user' };
  req.auth.role = roleFromProfile(req.auth.profile);
  return req.auth.profile;
}

export function requireRole(...allowedRoles) {
  const normalized = new Set(allowedRoles.map((role) => String(role).toLowerCase()));
  return async (req, res, next) => {
    if (!req.auth?.user) return deny(res, 401, 'Authentication required.');
    const profile = await getServerProfile(req);
    const role = roleFromProfile(profile);
    if (!normalized.has(role)) return deny(res, 403, 'Forbidden.');
    return next();
  };
}

export function requirePermission(permission) {
  return async (req, res, next) => {
    if (!req.auth?.user) return deny(res, 401, 'Authentication required.');
    const profile = await getServerProfile(req);
    const role = roleFromProfile(profile);
    const permissions = ROLE_PERMISSIONS[role] || new Set();
    if (!permissions.has('*') && !permissions.has(permission)) return deny(res, 403, 'Forbidden.');
    return next();
  };
}

export function requireOwnership(resolveOwnerId) {
  return async (req, res, next) => {
    if (!req.auth?.user) return deny(res, 401, 'Authentication required.');
    try {
      const ownerId = await resolveOwnerId(req);
      if (!ownerId || ownerId !== req.auth.user.id) return deny(res, 403, 'Forbidden.');
      return next();
    } catch {
      return deny(res, 403, 'Forbidden.');
    }
  };
}

export function rejectClientAuthorizationFields(req, res, next) {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const forbidden = new Set(['role', 'roles', 'permission', 'permissions', 'ownerId', 'owner_id', 'isAdmin', 'is_admin', 'userId', 'user_id']);
  const containsForbiddenField = (value, seen = new Set()) => {
    if (!value || typeof value !== 'object' || seen.has(value)) return false;
    seen.add(value);
    return Object.entries(value).some(([key, child]) => forbidden.has(key) || containsForbiddenField(child, seen));
  };
  if (containsForbiddenField(body)) return deny(res, 403, 'Authorization fields are server-controlled.');
  return next();
}

export function getRolePermissions() {
  return Object.fromEntries(Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => [role, [...permissions]]));
}
