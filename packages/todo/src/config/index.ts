import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import userHome from 'user-home';
import yaml from 'js-yaml';
import inquirer from 'inquirer';
import { promisify } from 'util';
import { migrate, currentVersion } from './migrate';

const writeFile = promisify(fs.writeFile);
const mkdirpAsync = promisify(mkdirp);

export type ProfileConfig = { type: string; [key: string]: string | undefined };

export type Config = {
  version: 2;
  currentProfile: string | undefined;
  // eslint-disable-next-line typescript/no-use-before-define
  profiles: { [key: string]: ProfileConfig };
};

const configPath = path.resolve(userHome, '.todocli', 'config.yml');
const defaultProfile = 'default';

async function save(content: Config) {
  await writeFile(configPath, yaml.safeDump(content, { skipInvalid: true }));
}

let config: Config;
export let hasConfig: boolean;
try {
  config = yaml.safeLoad(fs.readFileSync(configPath).toString());
  if (config.version !== currentVersion) {
    config = migrate(config);
    save(config);
  }
  hasConfig = true;
} catch (error) {
  config = { version: 2, currentProfile: undefined, profiles: {} };
  hasConfig = false;
}

export const profile =
  config.currentProfile || process.env.TODO_PROFILE || defaultProfile;
export const profiles = config.profiles;

export async function ask() {
  return inquirer.prompt<{
    dataPath: string;
    shouldEncrypt: boolean;
    encryptionKey: string | undefined;
  }>([
    {
      name: 'dataPath',
      message: 'Where should the data be stored?',
    },
    {
      type: 'confirm',
      name: 'shouldEncrypt',
      message: 'Should the file be encrypted',
    },
    {
      name: 'encryptionKey',
      message: 'Please enter the encryption key?',
      when: ({ shouldEncrypt }) => shouldEncrypt,
    },
  ]);
}

export async function createConfig() {
  await mkdirpAsync(path.dirname(configPath));
  const answers = await ask();

  await save({
    version: 2,
    currentProfile: undefined,
    profiles: {
      default: {
        type: 'yaml-file',
        path: answers.dataPath,
        encryptionKey: answers.encryptionKey,
      },
    },
  });
}

export async function createProfile(name: string) {
  const answers = await ask();
  config.profiles[name] = {
    type: 'yaml-file',
    path: answers.dataPath,
    encryptionKey: answers.encryptionKey,
  };
  await save(config);
}

export async function deleteProfile(name: string) {
  delete config.profiles[name];
  await save(config);
}

export async function updateProfileConfig(
  profile: string,
  data: ProfileConfig
) {
  config.profiles[profile] = data;
  await save(config);
}

export async function setCurrentProfile(name: string | undefined) {
  config.currentProfile = name;
  await save(config);
}
