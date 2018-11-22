import { flow, sortBy, head } from 'lodash/fp';
import { read } from '../core';
import chalk from 'chalk';

export const name = 'next';
export const help = 'Get info about what to do next';

type Options = {};

const findNext = flow([sortBy('priority'), head]);

export async function run(options: Options) {
  const upNext = findNext((await read()).todos);

  console.log(chalk`{gray Up next} {bold ${upNext.title}}`);
}
