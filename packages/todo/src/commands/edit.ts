import * as editor from '@relekang/cli-editor';

import { read, write } from '../core';
import { run as upNext } from './next';
import { profileOption } from '../cliOptions';

export const name = 'edit';
export const help = 'Raw edit of the todos as yaml';
export const namedOptions = [profileOption];

type Options = { profile?: string };

export async function run(options: Options) {
  const data = await read(options.profile);
  await editor.edit({
    getContentKey: () => 'content',
    fetch: async () => {
      return { todos: data.todos };
    },
    save: async ({ todos }) => {
      await write({ ...data, todos: todos }, options.profile);
    },
  });

  await upNext({ profile: options.profile });
}
