import inquirer from 'inquirer';

import { write } from '../storage';
import { read } from '../core';
import { updateConfig } from '../config';

export const name = 'encrypt';
export const help = '';

type Options = {};

export async function run(_options: Options) {
  const answers = await inquirer.prompt<{ key: string }>([
    {
      type: 'input',
      name: 'key',
      message: `Please enter the key for the encryption`,
    },
  ]);
  await write(await read(), answers.key);
  await updateConfig({
    version: 1,
    encryptionKey: answers.key,
  });
}
