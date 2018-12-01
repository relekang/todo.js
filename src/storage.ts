import fs from 'fs';
import { promisify } from 'util';
import yaml from 'js-yaml';

import { FileContent, CurrentFileContent } from './types';
import { decrypt, encrypt } from './crypto';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export async function read(
  path: string,
  encryptionKey?: string
): Promise<FileContent> {
  try {
    let fileContent = (await readFile(path)).toString();
    if (encryptionKey) {
      fileContent = decrypt(fileContent, encryptionKey);
    }
    return yaml.safeLoad(fileContent);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { version: 4, todos: [] };
    }
    throw error;
  }
}

export async function write(
  path: string,
  content: CurrentFileContent,
  encryptionKey?: string
): Promise<CurrentFileContent> {
  let contentToSave = yaml.safeDump(content, { skipInvalid: true });
  if (encryptionKey) {
    contentToSave = encrypt(contentToSave, encryptionKey);
  }
  await writeFile(path, contentToSave);
  return content;
}
