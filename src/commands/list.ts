import chalk from 'chalk';
import { sortBy } from 'lodash/fp';

import { readProfileContent } from '../core';
import { Todo } from '../types';
import { profileOption } from '../cliOptions';

export const name = 'list';
export const help = 'List all todos';
export const namedOptions = [profileOption];

type Options = { profile?: string };

function leadingZero(input: string) {
  return input.length === 1 ? `0${input}` : input;
}

const sort = sortBy<Todo>('priority');

export async function run(options: Options) {
  const data = await readProfileContent(options.profile);
  console.log(
    sort(data.todos)
      .map(
        ({ title }, index) =>
          chalk` {gray ${leadingZero(String(index + 1))}: }${title}`
      )
      .join('\n')
  );
}
