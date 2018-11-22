import fs from 'fs';
import { promisify } from 'util';
import yaml from 'js-yaml';

import { FileContent, CurrentFileContent } from './types';
import * as config from './config';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export async function read(): Promise<FileContent> {
  try {
    return yaml.safeLoad((await readFile(config.dataPath)).toString());
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { version: 2, todos: [] };
    }
    throw error;
  }
}

export async function write(
  content: CurrentFileContent
): Promise<CurrentFileContent> {
  await writeFile(config.dataPath, yaml.safeDump(content));
  return content;
}
