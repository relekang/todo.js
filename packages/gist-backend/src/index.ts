import yaml from 'js-yaml';
import Octokit, {
  GistsGetResponseFilesHelloWorldPythonTxt,
} from '@octokit/rest';
import { Crypto, StorageBackend } from '@relekang/todo/lib/storage';
import { FileContent, CurrentFileContent } from '@relekang/todo/lib/types';

type GistFile = GistsGetResponseFilesHelloWorldPythonTxt;
type ProfileConfig = {
  type: 'gist';
  id: string;
  token: string;
  encryptionKey?: string;
};

export default class GistBackend implements StorageBackend {
  profile: ProfileConfig;
  crypto: Crypto;
  client: Octokit;

  constructor(profile: ProfileConfig, crypto: Crypto) {
    this.profile = profile;
    this.crypto = crypto;
    this.client = new Octokit({});
    this.client.authenticate({
      type: 'token',
      token: profile.token,
    });
  }

  async read(): Promise<FileContent> {
    try {
      // @ts-ignore
      let file: GistFile = (await this.client.gists.get({
        gist_id: this.profile.id,
      })).data.files['todo.yml'];
      let fileContent = file.content;
      if (this.profile.encryptionKey) {
        fileContent = this.crypto.decrypt(
          fileContent,
          this.profile.encryptionKey
        );
      }
      return yaml.safeLoad(fileContent);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return { version: 4, todos: [] };
      }
      throw error;
    }
  }

  async write(content: CurrentFileContent): Promise<CurrentFileContent> {
    let contentToSave = yaml.safeDump(content, { skipInvalid: true });
    if (this.profile.encryptionKey) {
      contentToSave = this.crypto.encrypt(
        contentToSave,
        this.profile.encryptionKey
      );
    }
    await this.client.gists.update({
      gist_id: this.profile.id,
      // @ts-ignore
      files: { 'todo.yml': { filename: 'todo.yml', content: contentToSave } },
    });
    return content;
  }
}
