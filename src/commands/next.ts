import chalk from 'chalk';
import { flow, sortBy, head } from 'lodash/fp';

import { readProfileContent } from '../core';
import { profileOption } from '../cliOptions';

export const name = 'next';
export const help = 'Get info about what to do next';
export const namedOptions = [profileOption];

type Options = { profile?: string };

const findNext = flow([sortBy('priority'), head]);

export async function run(options: Options) {
  const upNext = findNext((await readProfileContent(options.profile)).todos);

  if (upNext) {
    console.log(chalk`{gray Up next} {bold ${upNext.title}}`);
  } else {
    console.log(chalk`{green Nothing todo ✅}`);
  }
}
