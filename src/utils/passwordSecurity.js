import crypto from 'crypto';

const PEPPER = process.env.PASSWORD_PEPPER || 'default-pepper-change-in-production';

// Argon2id simulation using PBKDF2 (Node.js doesn't have native Argon2)
// In production, use argon2 npm package
export function hash_password(plain_password) {
  const salt = crypto.randomBytes(32).toString('hex');
  const peppered = plain_password + PEPPER;
  const hash = crypto.pbkdf2Sync(peppered, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verify_password(plain_password, stored_hash) {
  const [salt, hash] = stored_hash.split(':');
  const peppered = plain_password + PEPPER;
  const computed_hash = crypto.pbkdf2Sync(peppered, salt, 100000, 64, 'sha512').toString('hex');
  return hash === computed_hash;
}

export function generate_reset_token() {
  return crypto.randomBytes(32).toString('hex');
}

export function hash_token(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function is_token_expired(created_at) {
  const now = Date.now();
  const token_age = now - created_at;
  return token_age > 15 * 60 * 1000; // 15 minutes
}