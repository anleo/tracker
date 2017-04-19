import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {TaskBoardItem} from '../models/task-board-item';

import {BoardItemResource} from "../resources/board-item.resource";
import * as moment from 'moment/moment';
import {Moment} from "moment";


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

  save(boardItem: TaskBoardItem): Observable<TaskBoardItem> {
    return this.boardItemResource.save(boardItem, {boardId: boardItem.board}).$observable;
  }

  update(boardItem: TaskBoardItem): Observable<TaskBoardItem> {
    return this.boardItemResource.update(boardItem, {boardId: boardItem.board, boardItemId: boardItem._id}).$observable;
  }

  remove(boardItem: TaskBoardItem): Observable<TaskBoardItem> {
    return this.boardItemResource.remove(boardItem, {boardId: boardItem.board, boardItemId: boardItem._id}).$observable;
  }
}
