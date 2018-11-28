import * as storage from './storage';
import * as config from './config';
import { FileContent, CurrentFileContent, ProfileContent, Todo } from './types';
import { CliError } from '@relekang/args';

const currentVersion = 3;

function migrate(data: FileContent): CurrentFileContent {
  switch (data.version) {
    case undefined:
    case 1:
      return {
        version: currentVersion,
        profiles: {
          [config.profile]: {
            todos: data.todos.map(title => ({ title })),
          },
        },
      };

    case 2:
      return {
        version: currentVersion,
        profiles: {
          [config.profile]: {
            todos: data.todos,
          },
        },
      };

    default:
      return data;
  }
}

export async function read(): Promise<CurrentFileContent> {
  let content = await storage.read();
  if (content.version !== currentVersion) {
    content = migrate(content);
    await storage.write(content);
  }
  return content;
}

export async function readProfileNames(): Promise<string[]> {
  const content = await read();
  return Object.keys(content.profiles);
}

export async function readProfileContent(
  profile: string = config.profile
): Promise<ProfileContent> {
  const content = await read();
  if (content.profiles[profile]) {
    return content.profiles[profile];
  }
  throw new CliError({
    message: `No data for profile '${profile}'`,
    exitCode: 1,
    showHelp: false,
  });
}

export async function write(
  content: CurrentFileContent
): Promise<CurrentFileContent> {
  await storage.write(content);
  return content;
}
export async function writeProfileContent(
  profileContent: ProfileContent,
  profile: string = config.profile
): Promise<ProfileContent> {
  const content = await read();
  await storage.write({
    ...content,
    profiles: {
      ...content.profiles,
      [profile]: profileContent,
    },
  });
  return profileContent;
}

export async function add(todo: Todo, profile = config.profile): Promise<void> {
  let content = await read();
  content.profiles[profile].todos = [...content.profiles[profile].todos, todo];
  await write(content);
}
