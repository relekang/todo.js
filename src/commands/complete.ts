import inquirer from 'inquirer';

import { writeProfileContent, readProfileContent } from '../core';
import { run as upNext } from './next';

export const name = 'complete';
export const help = 'Mark tasks as completed';

type Options = {};

export async function run(options: Options) {
  const data = await readProfileContent();
  const answers = await inquirer.prompt<{ complete: string[] }>([
    {
      type: 'checkbox',
      name: 'complete',
      message: 'Which tasks have you completed?',
      choices: data.todos.map(({ title }) => title),
    },
  ]);

  await writeProfileContent({
    ...data,
    todos: data.todos.filter(
      item => answers.complete.indexOf(item.title) === -1
    ),
  });

  await upNext({});
}
