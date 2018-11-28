type TodoV1 = string;
type TodoV2 = {
  title: string;
  priority?: number;
};

export type Todo = TodoV2;

export type CurrentFileContent = {
  version: 2;
  todos: TodoV2[];
};

export type FileContent =
  | {
      version: 1;
      todos: TodoV1[];
    }
  | CurrentFileContent;
