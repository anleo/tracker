import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {TaskBoard} from '../models/task-board';
import {Task} from '../models/task';

import {BoardResource} from "../resources/board.resource";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class BoardService {
  editBoard$: BehaviorSubject<TaskBoard> = new BehaviorSubject<TaskBoard>(null);

  constructor(private boardResource: BoardResource) {}

  getBoard(boardId: string): Observable<TaskBoard> {
    return this.boardResource.getBoard({boardId: boardId}).$observable;
  }

  getBoards(task: Task): Observable<TaskBoard[]> {
    return this.boardResource.getBoards({projectId: task._id}).$observable;
  }

  saveBoard(board: TaskBoard): Observable<TaskBoard> {
    return this.boardResource.save(board, {projectId: board.project}).$observable;
  }
}

