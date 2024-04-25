import { randomBytes, createHash } from 'crypto';

export function generateToken(
  salt: string,
  body: string,
  secret: string,
): string {
  const data = salt + body + secret;
  const hash = createHash('sha256').update(data).digest('hex');
  return hash;
}

export function genSalt(n: number): Promise<string> {
  return new Promise((resolve, reject) => {
    randomBytes(n, (err, buf) => {
      if (err) {
        reject(err);
        return;
      }
      const salt = buf.toString('base64');
      resolve(salt);
    });
  });
}
