import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import userHome from 'user-home';
import yaml from 'js-yaml';
import inquirer from 'inquirer';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const mkdirpAsync = promisify(mkdirp);

type Config = {
  version: 1;
  // eslint-disable-next-line
  dataPath?: string;
  profile?: string;
};

const defaultDataPath = path.join(userHome, '.todocli', 'data.yml');
const configPath = path.resolve(userHome, '.todocli', 'config.yml');
const defaultProfile = 'default';

let config: Config;
export let hasConfig: boolean;
try {
  config = yaml.safeLoad(fs.readFileSync(configPath).toString());
  hasConfig = true;
} catch (error) {
  config = { version: 1 };
  hasConfig = false;
}

export const dataPath = path.resolve(
  config.dataPath || process.env.TODO_FILE_PATH || defaultDataPath
);

export const profile =
  config.profile || process.env.TODO_PROFILE || defaultProfile;

export async function createConfig() {
  await mkdirpAsync(path.dirname(configPath));
  const answers = await inquirer.prompt<{ dataPath: string }>([
    {
      name: 'dataPath',
      message: 'Where should the data be stored?',
      default: defaultDataPath,
    },
  ]);

  await writeFile(
    configPath,
    yaml.safeDump({ version: 1, dataPath: answers.dataPath })
  );
}
