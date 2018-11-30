import { CommandOption } from '@relekang/args/lib/types';

import { readProfileNames, read } from '../core';
import { CliError } from '@relekang/args';
import { write } from '../storage';
import inquirer = require('inquirer');

export const name = 'profiles';
export const help = 'Manage profiles';

export const positionalOptions: CommandOption[] = [
  {
    name: 'task',
    required: true,
    help: 'Available tasks: list, add and delete.',
  },
];
export const namedOptions: CommandOption[] = [
  {
    name: 'name',
    required: false,
    help: 'The name of the profile applicable for add and delete.',
  },
];

type Options = {
  task: string;
  name?: string;
};

export async function run(options: Options) {
  switch (options.task) {
    case 'list': {
      const profiles = await readProfileNames();
      console.log(profiles.join('\n'));
      break;
    }
    case 'add': {
      if (!options.name) {
        throw new CliError({ message: 'Missing option name.', exitCode: 1 });
      }
      const data = await read();
      if (data.profiles[options.name]) {
        throw new CliError({
          message: 'The profile already exist.',
          exitCode: 1,
        });
      }
      data.profiles[options.name] = { todos: [] };
      await write(data);
      break;
    }
    case 'delete': {
      if (!options.name) {
        throw new CliError({ message: 'Missing option name.', exitCode: 1 });
      }
      const answers = await inquirer.prompt<{ confirm: boolean }>([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Are you sure you want to delete ${options.name}?`,
        },
      ]);

      if (answers.confirm) {
        const data = await read();
        delete data.profiles[options.name];
        await write(data);
        console.log(`Deleted ${options.name}`);
      }
      break;
    }
  }
}
