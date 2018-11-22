import { read, write } from '../core';

export const name = 'add';
export const help = 'Add a new todo';

export const positionalOptions = [{ name: 'title', required: true }];

type Options = {
  title: string;
};

export async function run(options: Options) {
  const data = await read();
  await write({
    ...data,
    todos: [...data.todos, { title: options.title }],
  });
}
