import chalk from 'chalk';
import { sortBy } from 'lodash/fp';
import bitbar from 'bitbar';

import { read } from '../core';
import { Todo } from '../types';
import { profileOption } from '../cliOptions';
import { CliError } from '@relekang/args';

export const name = 'list';
export const help = 'List all todos';
export const namedOptions = [
  profileOption,
  {
    name: 'format',
    help: 'Select format to print on, available formats: bitbar, default',
    transform: (value: string | undefined) => value || 'default',
  },
];

type Options = { profile?: string; format: string };

function leadingZero(input: string) {
  return input.length === 1 ? `0${input}` : input;
}

const sort = sortBy<Todo>('priority');

function formatter(format: string, value: Todo[]) {
  switch (format) {
    case 'default':
      return value
        .map(
          ({ title }, index) =>
            chalk` {gray ${leadingZero(String(index + 1))}: }${title}`
        )
        .join('\n');
    case 'bitbar':
      return bitbar.create([
        {
          text: value.length ? `${value.length}` : '✅',
          color: bitbar.darkMode ? 'white' : 'black',
          dropdown: false,
        },
        bitbar.separator,
        { text: value[0].title, size: 18 },
        bitbar.separator,
        ...value.slice(1).map(todo => ({ text: todo.title })),
        bitbar.separator,
        { text: 'Refresh', refresh: true },
      ]);
    default:
      throw new CliError({ message: 'Unknown format', exitCode: 1 });
  }
}

export async function run(options: Options) {
  const data = await read(options.profile);
  console.log(formatter(options.format, sort(data.todos)));
}
