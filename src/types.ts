export type Id = string | number;

export type Task = {
  id: Id;
  columnId: Id;
  type: string;
  task: string | null;
  dueDate: Date | null;
};
