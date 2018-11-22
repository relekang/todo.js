import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import userHome from 'user-home';
import yaml from 'js-yaml';

import { FileContent, CurrentConfig } from './types';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const filename = path.resolve(userHome, '.todos.yml');

export async function read(): Promise<FileContent> {
  try {
    return yaml.safeLoad((await readFile(filename)).toString());
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { version: 2, todos: [] };
    }
    throw error;
  }
}

export async function write(content: CurrentConfig): Promise<CurrentConfig> {
  await writeFile(filename, yaml.safeDump(content));
  return content;
}
