import {TaskBoard} from './task-board'

export class BoardWithStatus {
  board: TaskBoard|null;
  status: string; // update, remove, move, close
}
