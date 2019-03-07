declare module 'prompt-sync';
declare module 'prompt-list';
declare module 'bitbar';
declare module '@relekang/cli-editor' {
  export function edit<T>(options: {
    getContentKey: (item: T) => string;
    fetch: () => Promise<T>;
    save: (item: T) => Promise<void>;
  }): Promise<void>;
}
