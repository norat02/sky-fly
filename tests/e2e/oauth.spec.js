import { test, expect } from '@playwright/test';

const providers = [
  { id: 'google', label: 'Google', envPrefix: 'GOOGLE' },
  { id: 'apple', label: 'Apple', envPrefix: 'APPLE' },
  { id: 'microsoft', label: 'Microsoft', envPrefix: 'MICROSOFT' },
];

function hasProviderCredentials(prefix) {
  return Boolean(
    process.env[`E2E_${prefix}_EMAIL`]
    && process.env[`E2E_${prefix}_PASSWORD`]
  );
}

async function assertAuthPage(page, path = '/login') {
  await page.goto(path);
  await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue with Apple' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue with Microsoft' })).toBeVisible();
  await expect(page.getByLabel('Username')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
}

test.describe('OAuth entry points', () => {
  test('Login exposes all OAuth providers and preserves password login', async ({ page }) => {
    await assertAuthPage(page, '/login');
  });

  test('Register exposes all OAuth providers and preserves account creation form', async ({ page }) => {
    await assertAuthPage(page, '/register');
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Confirm Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
  });

  for (const provider of providers) {
    test.skip(
      !process.env.E2E_TEST_OAUTH_REDIRECTS,
      'Set E2E_TEST_OAUTH_REDIRECTS=1 to start real provider redirects.',
    );

    test(`${provider.label} button starts an OAuth redirect`, async ({ page }) => {
      await page.goto('/login');
      const providerButton = page.getByRole('button', { name: `Continue with ${provider.label}` });
      await expect(providerButton).toBeEnabled();

      const navigation = page.waitForURL((url) => {
        const host = url.hostname;
        return host.includes('supabase.co')
          || host.includes('accounts.google.com')
          || host.includes('appleid.apple.com')
          || host.includes('login.microsoftonline.com');
      }, { timeout: 10_000 });

      await providerButton.click();
      await expect(providerButton).toBeDisabled();
      await navigation;

      const url = page.url();
      expect(url).toMatch(/supabase\.co|accounts\.google\.com|appleid\.apple\.com|login\.microsoftonline\.com/);
    });
  }
});

test.describe('OAuth callback error handling', () => {
  test('renders a cancellation message from a provider callback', async ({ page }) => {
    await page.goto('/login#error=access_denied&error_description=The%20user%20denied%20access');
    await expect(page.getByText(/sign-in was canceled/i)).toBeVisible();
    await expect(page.getByLabel('Username')).toBeVisible();
  });

  test('renders a duplicate-email message from a provider callback', async ({ page }) => {
    await page.goto('/register#error=identity_already_exists&error_description=Identity%20already%20exists');
    await expect(page.getByText(/already connected to a Whisper account/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
  });
});

for (const provider of providers) {
  test.describe(`${provider.label} authenticated flow`, () => {
    test.skip(
      !process.env.E2E_RUN_PROVIDER_AUTH || !hasProviderCredentials(provider.envPrefix),
      'Set E2E_RUN_PROVIDER_AUTH=1 and provider test credentials to run real consent flows.',
    );

    test(`signs in with ${provider.label} and returns to the app`, async ({ page }) => {
      await page.goto('/login');
      await page.getByRole('button', { name: `Continue with ${provider.label}` }).click();

      // Provider pages may require MFA, consent, or a first-time account setup.
      // These selectors intentionally fail with a useful trace if the provider UI changes.
      if (provider.id === 'google') {
        await page.getByLabel(/Email or phone/i).fill(process.env[`E2E_${provider.envPrefix}_EMAIL`]);
        await page.getByRole('button', { name: /Next/i }).click();
        await page.getByLabel(/Enter your password/i).fill(process.env[`E2E_${provider.envPrefix}_PASSWORD`]);
        await page.getByRole('button', { name: /Next/i }).click();
      } else if (provider.id === 'apple') {
        await page.getByLabel('Apple ID').fill(process.env[`E2E_${provider.envPrefix}_EMAIL`]);
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.getByLabel(/password/i).fill(process.env[`E2E_${provider.envPrefix}_PASSWORD`]);
        await page.getByRole('button', { name: /Sign In/i }).click();
      } else {
        await page.getByLabel(/Email, phone, or Skype/i).fill(process.env[`E2E_${provider.envPrefix}_EMAIL`]);
        await page.getByRole('button', { name: /Next/i }).click();
        await page.getByLabel(/Password/i).fill(process.env[`E2E_${provider.envPrefix}_PASSWORD`]);
        await page.getByRole('button', { name: /Sign in/i }).click();
      }

      await expect(page).toHaveURL((url) => !url.pathname.endsWith('/login') && !url.pathname.endsWith('/register'), { timeout: 30_000 });
      await expect(page.locator('#root')).toBeVisible();
    });
  });
}
