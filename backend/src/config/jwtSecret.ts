/**
 * Single source of truth for the JWT signing/verification secret.
 *
 * Every route/middleware that signs or verifies an auth token must import
 * JWT_SECRET from here rather than reading process.env.JWT_SECRET itself,
 * so the fail-fast behaviour below is consistent everywhere.
 *
 * In production, a missing JWT_SECRET is a critical misconfiguration: the
 * previous fallback ('fallback-secret') was a fixed, guessable literal —
 * anyone who discovered it could forge a valid token for any userId/role.
 * We now refuse to start at all in that case, rather than silently
 * running with a forgeable secret. This throws at module-load time
 * (before the server starts listening), which is a clear, immediate
 * startup failure visible in deploy logs — never the secret value itself.
 *
 * Outside production (local dev, tests) a clearly-labelled, non-secret
 * placeholder is used instead, so the app can still run without real
 * secret material. This value is never reachable in production, since
 * the check above throws first.
 */
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && !process.env.JWT_SECRET) {
  throw new Error(
    'JWT_SECRET is not set. Refusing to start in production without a real JWT signing secret.'
  );
}

if (!isProduction && !process.env.JWT_SECRET) {
  // eslint-disable-next-line no-console
  console.warn(
    '[jwtSecret] JWT_SECRET is not set — using a non-production placeholder secret. ' +
    'This is only safe outside production.'
  );
}

export const JWT_SECRET =
  process.env.JWT_SECRET || 'dev-only-insecure-secret-do-not-use-in-production';
