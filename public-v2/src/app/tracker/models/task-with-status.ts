import {Task} from './task'

export class TaskWithStatus {
  task: Task|null;
  status: string; // update, remove, move, close
}
