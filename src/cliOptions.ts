import { CommandOption } from '@relekang/args/lib/types';

export const profileOption: CommandOption = {
  name: 'profile',
  help: 'Set the profile to be used when running the command',
  required: false,
};
