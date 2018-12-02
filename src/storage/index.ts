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
    default:
      throw new CliError({
        message: `Missing storage backend for type ${profile.type}`,
        exitCode: 1,
      });
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
