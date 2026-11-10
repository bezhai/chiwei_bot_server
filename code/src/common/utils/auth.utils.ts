import { createHash } from 'crypto';

export function generateToken(
  salt: string,
  body: string,
  secret: string,
): string {
  const data = salt + body + secret;
  const hash = createHash('sha256').update(data).digest('hex');
  return hash;
}
