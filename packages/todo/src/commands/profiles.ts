import { CommandOption } from '@relekang/args/lib/types';
import { CliError } from '@relekang/args';
import inquirer from 'inquirer';

import * as config from '../config';

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
      const profiles = Object.keys(config.profiles);
      console.log(profiles.join('\n'));
      break;
    }
    case 'add': {
      if (!options.name) {
        throw new CliError({ message: 'Missing option name.', exitCode: 1 });
      }
      if (config.profiles[options.name]) {
        throw new CliError({
          message: 'The profile already exist.',
          exitCode: 1,
        });
      }
      config.createProfile(options.name);
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
        config.deleteProfile(options.name);
        console.log(`Deleted ${options.name}`);
      }
      break;
    }
  }
}
