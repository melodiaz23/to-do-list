export type Id = string | number;

export type Task = {
  id: Id;
  columnId: Id;
  task: string | null;
};
