import {Injectable} from "@angular/core";
import {TaskBoardItem} from "../models/task-board-item";
import {BoardItemService} from "app/tracker/services/board-item.service";
import {TaskService} from "./task.service";
import {Observable} from "rxjs/Observable";
import * as moment from 'moment/moment';
import {Moment} from "moment";

@Injectable()
export class BoardItemSpentTimeService {

  constructor(private taskService: TaskService,
              private boardItemService: BoardItemService) {
  }

  hasTimeLog(boardItem) {
    return !!(boardItem.timeLog && boardItem.timeLog.length);
  }

  addTimeLog(boardItem, status): TaskBoardItem {
    let timeLogRecord = {status: status, time: Date.now()};

    this.hasTimeLog(boardItem)
      ? boardItem.timeLog.push(timeLogRecord)
      : boardItem.timeLog = [timeLogRecord];

    boardItem.item.status = status;

    return boardItem;
  }

  boardItemStatusProvider(boardItem: TaskBoardItem, status: string) {
    if (boardItem.item.status == status) {
      return;
    } else if (status === 'accepted') {
      if (boardItem.item.status == 'in progress') {
        boardItem = this.addTimeLog(boardItem, '');
      }
    }

    boardItem = this.addTimeLog(boardItem, status);


    return this.boardItemService
      .update(boardItem)
      .switchMap(result => this.taskService.updateTask(boardItem.item))
  }

  getBoardItemSpendTime(boardItem: TaskBoardItem): Observable <Moment> {
    let spentTime = 0;
    let lastInProgress = null;

    boardItem.timeLog.forEach(log => {
      if (log.status === 'in progress') {
        lastInProgress = log.time;
      } else if (log.status === '') {
        spentTime += log.time - lastInProgress;
      }
    });

    if (boardItem.item.status === 'in progress') {
      spentTime += Date.now() - lastInProgress;
    }

    return Observable.of(moment(spentTime).utc());
  }

}
