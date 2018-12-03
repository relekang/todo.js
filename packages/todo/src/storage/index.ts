import { CliError } from '@relekang/args';

import { FileContent, CurrentFileContent } from '../types';
import { ProfileConfig } from '../config';
import * as crypto from '../crypto';
import { YamlBackend } from './yaml';

export interface Crypto {
  encrypt(input: string, key: string): string;
  decrypt(input: string, key: string): string;
}

export interface StorageBackend {
  read(): Promise<FileContent>;
  write(content: CurrentFileContent): Promise<CurrentFileContent>;
}

export function getBackend(profile: ProfileConfig): StorageBackend {
  switch (profile.type) {
    case 'yaml-file':
      return new YamlBackend(profile, crypto);

    case 'gist': {
      const name = `@relekang/todo-${profile.type}-backend`;
      try {
        const Backend = require(name).default;
        return new Backend(profile, crypto);
      } catch (error) {
        throw new CliError({
          message: `Missing storage backend for type ${
            profile.type
          }.\n You can install it with npm i -g ${name}`,
          exitCode: 1,
        });
      }
    }

    case 'local': {
      if (profile.requirePath) {
        const Backend = require(profile.requirePath).default;
        return new Backend(profile, crypto);
      }
      throw new CliError({
        message: 'Missing requirePath on profile',
        exitCode: 1,
      });
    }

    default: {
      const name = `todo-${profile.type}-backend`;
      try {
        const Backend = require(name).default;
        return new Backend(profile, crypto);
      } catch (error) {
        throw new CliError({
          message: `Missing storage backend for type ${
            profile.type
          }.\nThere might be a plugin called ${name}`,
          exitCode: 1,
        });
      }
    }
  }
}

export async function read(profile: ProfileConfig): Promise<FileContent> {
  return getBackend(profile).read();
}

export async function write(
  profile: ProfileConfig,
  content: CurrentFileContent
): Promise<CurrentFileContent> {
  return getBackend(profile).write(content);
}
