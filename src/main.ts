import path from 'path';
import args from '@relekang/args';

import { hasConfig, createConfig } from './config';

args({
  name: 'todo',
  commandsPath: path.resolve(__dirname, './commands'),
  defaultCommand: 'next',
  needsSetup: () => !hasConfig,
  setup: createConfig,
})(process.argv);
