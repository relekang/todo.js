import * as storage from './storage';
import { FileContent, CurrentConfig } from './types';

const currentVersion = 2;

function migrate(data: FileContent): CurrentConfig {
  switch (data.version) {
    case undefined:
    case 1:
      return {
        version: currentVersion,
        todos: data.todos.map(title => ({ title })),
      };
    default:
      return data;
  }
}

export async function read(): Promise<CurrentConfig> {
  let content = await storage.read();
  if (content.version !== currentVersion) {
    content = migrate(content);
    await storage.write(content);
  }
  return content;
}

export async function write(content: CurrentConfig): Promise<CurrentConfig> {
  storage.write(content);
  return content;
}
