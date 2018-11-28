import prompt from 'prompt-sync';
import chalk from 'chalk';

import { readProfileContent, writeProfileContent } from '../core';
import { Todo } from '../types';
import { run as upNext } from './next';
import { profileOption } from '../cliOptions';

export const name = 'pri';
export const help = 'Prioritise all the things';
export const namedOptions = [profileOption];

type Options = { profile?: string };

export async function run(options: Options) {
  let abort = false;
  function sorter(a: Todo, b: Todo): number {
    if (abort) {
      return 0;
    }

    console.log('');
    console.log('a:', a.title);
    console.log('b:', b.title);
    console.log('');

    const answer: string = prompt()('Which is more important? ');
    if (answer === null) {
      console.log(chalk.red('Aborting 🙈'));
      abort = true;
      return 0;
    }

    if (!/a|b/.test(answer)) {
      console.log(chalk`{yellow Available options:  {bold a}, {bold b}}`);
      return sorter(a, b);
    }

    return answer === 'a' ? -1 : 1;
  }
  const data = await readProfileContent(options.profile);
  const { todos } = data;

  todos.sort(sorter);

  if (!abort) {
    await writeProfileContent(
      {
        ...data,
        todos: todos.map((item, index) => ({ ...item, priority: index })),
      },
      options.profile
    );
    await upNext({ profile: options.profile });
  }
}
