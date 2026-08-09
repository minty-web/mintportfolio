import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";

const SESSION_COOKIE = "admin_session";
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET is not set (or is too short). Set SESSION_SECRET to at least 32 characters in the Netlify environment variables and redeploy."
    );
  }
  return secret;
}

function isHttpsSite(): boolean {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").protocol === "https:";
  } catch {
    return false;
  }
}

function timingSafeEqualStr(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function timingSafeEqualBuf(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Verify a username + password against the ADMIN_* environment variables. */
export async function verifyCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const envUsername = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const plainPassword = process.env.ADMIN_PASSWORD;

  if (!envUsername || (!passwordHash && !plainPassword)) {
    throw new Error(
      "Admin is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD_HASH (or ADMIN_PASSWORD) in .env"
    );
  }

  if (!timingSafeEqualStr(username, envUsername)) return false;

  if (passwordHash) {
    // Format: scrypt:<N>:<r>:<p>:<salt_hex>:<derived_key_hex>
    const parts = passwordHash.split(":");
    if (parts.length !== 6 || parts[0] !== "scrypt") return false;
    const N = Number(parts[1]);
    const r = Number(parts[2]);
    const p = Number(parts[3]);
    const salt = Buffer.from(parts[4], "hex");
    const expected = Buffer.from(parts[5], "hex");
    const actual = crypto.scryptSync(password, salt, expected.length, { N, r, p });
    return timingSafeEqualBuf(actual, expected);
  }

  // Plain-password fallback (still compared in constant time).
  return timingSafeEqualStr(password, plainPassword ?? "");
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

/** Set the signed session cookie. Only call from a Server Function or Route Handler. */
export async function createSession(): Promise<void> {
  const ttl =
    parseInt(process.env.ADMIN_SESSION_TTL ?? "", 10) || DEFAULT_TTL_SECONDS;
  const expires = Math.floor(Date.now() / 1000) + ttl;
  const payload = `${expires}`;
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    // Only mark the cookie Secure when the site is served over HTTPS.
    secure: isHttpsSite(),
    path: "/",
    maxAge: ttl,
  });
}

/** True when the request carries a valid, unexpired session cookie. */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;
  if (!value) return false;

  const dot = value.lastIndexOf(".");
  if (dot === -1) return false;
  const payload = value.slice(0, dot);
  const signature = value.slice(dot + 1);

  const expected = sign(payload);
  if (!timingSafeEqualStr(signature, expected)) return false;

  const expires = Number(payload);
  if (Number.isNaN(expires)) return false;

  return expires > Math.floor(Date.now() / 1000);
}

/** Protect a route: redirects to /admin/login when there is no valid session. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
}

/** Clear the session cookie. Only call from a Server Function or Route Handler. */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
