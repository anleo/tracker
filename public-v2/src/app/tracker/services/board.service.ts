import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {TaskBoard} from '../models/task-board';
import {Task} from '../models/task';
import {BoardWithStatus} from '../models/board-with-status';

import {BoardResource} from "../resources/board.resource";
import {BehaviorSubject} from "rxjs";
import * as _ from 'lodash';

@Injectable()
export class BoardService {
  editBoard$: BehaviorSubject<TaskBoard> = new BehaviorSubject<TaskBoard>(null);
  editBoardModal$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  editBoardUpdated$: BehaviorSubject<BoardWithStatus> = new BehaviorSubject<BoardWithStatus>(null);

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

  saveChildBoard(board: TaskBoard, parentBoardId: string): Observable<TaskBoard> {
    let data = _.assign({}, board, {board: parentBoardId});

    if (data && data._id) {
      return this.boardResource.update(data, {projectId: board.project, boardId: data._id}).$observable;
    } else {
      return this.boardResource.save(data, {projectId: board.project}).$observable;
    }
  }

  removeBoard(board: TaskBoard): Observable<TaskBoard> {
    return this.boardResource.remove({projectId: board.project, boardId: board._id}).$observable;
  }
}

