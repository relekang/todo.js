import args from '@relekang/args';

import { hasConfig, createConfig } from './config';
import * as add from './commands/add';
import * as list from './commands/list';
import * as next from './commands/next';
import * as pri from './commands/pri';
import * as complete from './commands/complete';

args({
  name: 'todo',
  commands: { add, list, next, pri, complete },
  defaultCommand: 'next',
  needsSetup: () => !hasConfig,
  setup: createConfig,
})(process.argv);
