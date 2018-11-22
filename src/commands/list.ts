import chalk from 'chalk';

import { read } from '../core';

export const name = 'list';
export const help = 'List all todos';

type Options = {};

function leadingZero(input: string) {
  return input.length === 1 ? `0${input}` : input;
}

export async function run(options: Options) {
  const data = await read();
  console.log(
    data.todos
      .map(
        ({ title }, index) =>
          chalk` {gray ${leadingZero(String(index + 1))}: }${title}`
      )
      .join('\n')
  );
}
