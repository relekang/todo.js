import { CommandOption } from '@relekang/args/lib/types';

import { add } from '../core';

export const name = 'add';
export const help = 'Add a new todo';

export const positionalOptions: CommandOption[] = [
  { name: 'title', required: true },
];
export const namedOptions: CommandOption[] = [
  {
    name: 'pri',
    help: 'Add the task to top of the list',
    required: false,
    transform: Boolean,
  },
];

type Options = {
  title: string;
  pri: boolean;
};

export async function run(options: Options) {
  await add({
    title: options.title,
    priority: options.pri ? 1 : undefined,
  });
}
