import fs from 'fs';
import { promisify } from 'util';
import yaml from 'js-yaml';
import crypto from 'crypto';

import { FileContent, CurrentFileContent } from './types';
import * as config from './config';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

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

export async function read(): Promise<FileContent> {
  try {
    const fileContent = (await readFile(config.dataPath)).toString();
    if (config.encryptionKey) {
      return yaml.safeLoad(decrypt(fileContent, config.encryptionKey));
    }
    return yaml.safeLoad(fileContent);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { version: 3, profiles: { default: { todos: [] } } };
    }
    throw error;
  }
}

export async function write(
  content: CurrentFileContent,
  initialEncryptionKey?: string
): Promise<CurrentFileContent> {
  let contentToSave;
  if (config.encryptionKey) {
    contentToSave = encrypt(
      yaml.safeDump(content, { skipInvalid: true }),
      config.encryptionKey
    );
  } else if (initialEncryptionKey) {
    contentToSave = encrypt(
      yaml.safeDump(content, { skipInvalid: true }),
      initialEncryptionKey
    );
  } else {
    contentToSave = yaml.safeDump(content, { skipInvalid: true });
  }
  await writeFile(config.dataPath, contentToSave);
  return content;
}
