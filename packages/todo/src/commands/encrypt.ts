import inquirer from 'inquirer';

import { write } from '../storage';
import { read } from '../core';
import * as config from '../config';
import { profileOption } from '../cliOptions';

export const name = 'encrypt';
export const help = '';

export const positionalOptions = [profileOption];

type Options = { profile: string };

export async function run(options: Options) {
  const answers = await inquirer.prompt<{ key: string }>([
    {
      type: 'input',
      name: 'key',
      message: `Please enter the key for the encryption`,
    },
  ]);
  const profile = options.profile || config.profile;
  const existingContent = await read(profile);
  await config.updateProfileConfig(profile, {
    ...config.profiles[profile],
    encryptionKey: answers.key,
  });
  await write(config.profiles[profile], existingContent);
}
