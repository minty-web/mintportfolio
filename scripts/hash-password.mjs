// Generates an scrypt password hash for ADMIN_PASSWORD_HASH.
// Usage: node scripts/hash-password.mjs "your-password"
import crypto from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-password.mjs <password>");
  process.exit(1);
}

const N = 16384;
const r = 8;
const p = 1;
const salt = crypto.randomBytes(16);
const key = crypto.scryptSync(password, salt, 32, { N, r, p });
const hash = `scrypt:${N}:${r}:${p}:${salt.toString("hex")}:${key.toString("hex")}`;

console.log(hash);
