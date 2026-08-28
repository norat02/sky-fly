# AI Moderation for Translation APIs

Whisper now evaluates user-generated text on the server before sending it to the translation provider. The moderation result is normalized to `allow`, `review`, or `block` with a bounded risk level, approved categories, confidence in `[0, 1]`, and a machine-safe reason code.

| Decision | API behavior |
|---|---|
| `allow` | Continue to translation |
| `review` | Return HTTP `202` and do not translate automatically |
| `block` | Return HTTP `403` and never call the translation provider |

The classifier treats message content as untrusted data and does not follow instructions embedded in it. It covers community abuse, violence or danger, actionable cyber abuse/exploitation, fraud, harassment, self-harm, and policy evasion. Safe educational cybersecurity discussion should remain distinguishable from actionable abuse. Synthetic fixtures in tests are non-executable markers and do not contain real exploit instructions, credentials, targets, or payloads.

Single and batch routes enforce authentication, server-side translation permission, recursive rejection of client-controlled authorization fields, language allowlists, item/count/size limits, moderation before translation, and generic redacted errors. Batch requests are rejected as a whole when any item is blocked or pending review, so safe items cannot leak through a partially translated response.

## Test commands

Run `npm run test:security` for authorization and moderation unit tests. Run `npm run test:integration` for HTTP-level translation endpoint tests using mocked authentication, moderation, and translation providers. The staging workflow runs both suites before Playwright.

## Configuration

`GEMINI_MODERATION_MODEL` optionally selects the server-side Gemini moderation model. `MODERATION_FAIL_MODE` defaults to `review`; set it to `block` only when the deployment policy requires hard fail-closed behavior. Credentials must remain server-side and must not be placed in frontend environment variables, browser storage, responses, or logs.
