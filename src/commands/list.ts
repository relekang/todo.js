import chalk from 'chalk';
import { sortBy } from 'lodash/fp';

import { read } from '../core';

export const name = 'list';
export const help = 'List all todos';

type Options = {};

function leadingZero(input: string) {
  return input.length === 1 ? `0${input}` : input;
}

const sort = sortBy('priority');

export async function run(options: Options) {
  const data = await read();
  console.log(
    sort(data.todos)
      .map(
        ({ title }, index) =>
          chalk` {gray ${leadingZero(String(index + 1))}: }${title}`
      )
      .join('\n')
  );
}
