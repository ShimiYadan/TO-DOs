export interface Todo {
    _id: string;
    userId: string;
    title: string;
    deadline: Date;
    completed: boolean;
  }