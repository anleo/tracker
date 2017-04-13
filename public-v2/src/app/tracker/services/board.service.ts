import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {TaskBoard} from '../models/task-board';
import {Task} from '../models/task';

import {BoardResource} from "../resources/board.resource";

@Injectable()
export class BoardService {
  constructor(private boardResource: BoardResource) {}

  getBoards(task: Task): Observable<TaskBoard[]> {
    return this.boardResource.getBoards({projectId: task._id}).$observable;
  }

  saveBoard(board: TaskBoard): Observable<TaskBoard> {
    return this.boardResource.save(board, {projectId: board.project}).$observable;
  }

  getboardMetrics(boardId: string): Observable<TaskBoard> {
    return this.boardResource.getboardMetrics({boardId: boardId}).$observable;
  }

}

