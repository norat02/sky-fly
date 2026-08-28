const CANCEL_CODES = new Set([
  'access_denied',
  'user_cancelled',
  'user_canceled',
  'popup_closed_by_user',
]);

const DUPLICATE_CODES = new Set([
  'email_exists',
  'email_already_exists',
  'identity_already_exists',
  'user_already_exists',
  'account_exists',
]);

function normalize(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
}

export function getOAuthErrorMessage(error) {
  const source = typeof error === 'string' ? error : error?.message || error?.error_description || '';
  const code = normalize(error?.code || error?.error_code || error?.status || source);
  const message = String(source).toLowerCase();

  if (CANCEL_CODES.has(code) || message.includes('access_denied') || message.includes('cancel')) {
    return 'Sign-in was canceled. No account changes were made. You can try again whenever you are ready.';
  }

  if (
    DUPLICATE_CODES.has(code)
    || message.includes('already registered')
    || message.includes('already exists')
    || message.includes('email address is already')
    || message.includes('identity is already linked')
  ) {
    return 'This email is already connected to a Whisper account. Choose Sign in instead, or use the original sign-in method for this account.';
  }

  if (message.includes('redirect_uri') || message.includes('redirect uri')) {
    return 'This sign-in provider is not configured for this environment. Please contact the workspace administrator.';
  }

  if (message.includes('provider') && (message.includes('not enabled') || message.includes('unsupported'))) {
    return 'This sign-in provider is not enabled yet. Please choose another method or contact the workspace administrator.';
  }

  return source || 'We could not complete sign-in with this provider. Please try again.';
}

export function getOAuthErrorFromLocation(location = window.location) {
  const params = new URLSearchParams();
  const query = new URLSearchParams(location.search);
  const hash = new URLSearchParams(String(location.hash || '').replace(/^#/, ''));

  for (const [key, value] of query) params.set(key, value);
  for (const [key, value] of hash) params.set(key, value);

  const error = params.get('error') || params.get('error_code') || params.get('error_description');
  if (!error) return '';

  return getOAuthErrorMessage({
    code: params.get('error_code') || error,
    message: params.get('error_description') || error,
  });
}
