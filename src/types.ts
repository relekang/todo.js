type TodoV1 = string;
type TodoV2 = { title: string };
export type Todo = TodoV2;

export type CurrentConfig = {
  version: 2;
  todos: TodoV2[];
  piority?: number;
};
export type FileContent =
  | {
      version: 1;
      todos: TodoV1[];
    }
  | CurrentConfig;
