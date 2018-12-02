import fs from 'fs';
import { promisify } from 'util';
import yaml from 'js-yaml';

import { StorageBackend, Crypto } from './';
import { ProfileConfig } from '../config';
import { FileContent, CurrentFileContent } from '../types';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export class YamlBackend implements StorageBackend {
  profile: ProfileConfig;
  crypto: Crypto;

  constructor(profile: ProfileConfig, crypto: Crypto) {
    this.profile = profile;
    this.crypto = crypto;
  }

  async read(): Promise<FileContent> {
    try {
      let fileContent = (await readFile(this.profile.path)).toString();
      if (this.profile.encryptionKey) {
        fileContent = this.crypto.decrypt(
          fileContent,
          this.profile.encryptionKey
        );
      }
      return yaml.safeLoad(fileContent);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return { version: 4, todos: [] };
      }
      throw error;
    }
  }

  async write(content: CurrentFileContent): Promise<CurrentFileContent> {
    let contentToSave = yaml.safeDump(content, { skipInvalid: true });
    if (this.profile.encryptionKey) {
      contentToSave = this.crypto.encrypt(
        contentToSave,
        this.profile.encryptionKey
      );
    }
    await writeFile(this.profile.path, contentToSave);
    return content;
  }
}
