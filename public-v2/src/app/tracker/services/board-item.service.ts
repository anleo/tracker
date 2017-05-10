import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {TaskBoardItem} from '../models/task-board-item';

import {BoardItemResource} from "../resources/board-item.resource";
import * as moment from 'moment/moment';
import {Moment} from "moment";
import {TaskBoard} from "../models/task-board";

@Injectable()
export class BoardItemService {
  constructor(private boardItemResource: BoardItemResource) {
  }

  getRootBoardItemsByProject(projectId: string): Observable<TaskBoardItem[]> {
    return this.boardItemResource.getRootBoardItemsByProject({projectId: projectId}).$observable;
  }

  getBoardItemsByBoardId(boardId: string): Observable<TaskBoardItem[]> {
    return this.boardItemResource.getBoardItemsByBoardId({boardId: boardId}).$observable;
  }

  getBoardItemById(boardItemId: string): Observable<TaskBoardItem> {
    return this.boardItemResource.getBoardItemById({boardItemId: boardItemId}).$observable;
  }

  save(boardItem: TaskBoardItem): Observable<TaskBoardItem> {
    return this.boardItemResource.save(boardItem, {boardId: boardItem.board._id || boardItem.board}).$observable;
  }

  update(boardItem: TaskBoardItem): Observable<TaskBoardItem> {
    return this.boardItemResource.update(boardItem, {
      boardId: boardItem.board._id || boardItem.board,
      boardItemId: boardItem._id
    }).$observable;
  }

  remove(boardItem: TaskBoardItem): Observable<TaskBoardItem> {
    return this.boardItemResource.remove(boardItem, {
      boardId: boardItem.board._id || boardItem.board,
      boardItemId: boardItem._id
    }).$observable;
  }

  removeBoardItemByBoard(board: TaskBoard): Observable<TaskBoard> {
    return this.boardItemResource.removeBoardItemByBoard({boardId: board._id}).$observable;
  }


}
