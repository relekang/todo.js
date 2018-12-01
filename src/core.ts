import { CliError } from '@relekang/args';

import * as storage from './storage';
import * as config from './config';
import { FileContent, CurrentFileContent, Todo } from './types';

const currentVersion = 4;

function migrate(data: FileContent): CurrentFileContent {
  switch (data.version) {
    case undefined:
    case 1:
      return {
        version: currentVersion,
        todos: data.todos.map(title => ({ title })),
      };

    case 2:
      return {
        version: currentVersion,
        todos: data.todos,
      };

    case 3:
      throw new CliError({
        message: 'Please update the file content from version 3 to 4.',
        exitCode: 1,
      });

    default:
      return data;
  }
}

export async function read(
  profile = config.profile
): Promise<CurrentFileContent> {
  const profileConfig = config.profiles[profile];
  if (profileConfig && profileConfig.path) {
    let content = await storage.read(
      profileConfig.path,
      profileConfig.encryptionKey
    );
    if (content.version !== currentVersion) {
      content = migrate(content);
      await storage.write(profileConfig.path, content);
    }
    return content;
  }
  throw new CliError({
    message: `Missing profile ${config.profile}`,
    exitCode: 1,
  });
}

export async function write(
  content: CurrentFileContent,
  profile = config.profile
): Promise<CurrentFileContent> {
  const profileConfig = config.profiles[profile];
  if (profileConfig && profileConfig.path) {
    await storage.write(
      profileConfig.path,
      content,
      profileConfig.encryptionKey
    );
    return content;
  }
  throw new CliError({
    message: `Missing profile ${config.profile}`,
    exitCode: 1,
  });
}

export async function add(todo: Todo, profile = config.profile): Promise<void> {
  let content = await read(profile);
  content.todos = [...content.todos, todo];
  await write(content, profile);
}
