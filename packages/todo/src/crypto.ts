import crypto from 'crypto';

// Changing these is a breaking change
export const ALGORITHM = 'aes-256-ctr';
export const KEY_ALGORITHM = 'sha256';

export function createKey(key: string) {
  return crypto
    .createHash(KEY_ALGORITHM)
    .update(key)
    .digest('base64')
    .substr(0, 32);
}

export function encrypt(text: string, key: string) {
  const IV = new Buffer(crypto.randomBytes(16)).toString('hex').substr(0, 16);
  const encryptor = crypto.createCipheriv(ALGORITHM, createKey(key), IV);
  encryptor.setEncoding('hex');
  encryptor.write(text);
  encryptor.end();
  return `${encryptor.read()}$${IV}`;
}

export function decrypt(input: string, key: string) {
  const [text, iv] = input.split('$');
  const decryptor = crypto.createDecipheriv(ALGORITHM, createKey(key), iv);
  const decrypted = decryptor.update(text, 'hex');
  return decrypted + decryptor.final('utf-8');
}
