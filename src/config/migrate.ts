import { Config } from '.';

export type ConfigFileContent =
  | {
      version: 1;
      dataPath?: string;
      profile?: string;
      encryptionKey?: string;
    }
  | Config;

export const currentVersion = 2;

export function migrate(data: ConfigFileContent): Config {
  switch (data.version) {
    case undefined:
    case 1:
      return {
        version: currentVersion,
        currentProfile: data.profile,
        profiles: data.dataPath
          ? {
              default: {
                type: 'yaml-file',
                path: data.dataPath,
                encryptionKey: data.encryptionKey,
              },
            }
          : {},
      };

    default:
      return data;
  }
}
