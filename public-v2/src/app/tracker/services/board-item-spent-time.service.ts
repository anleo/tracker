import {Injectable} from "@angular/core";
import {TaskBoardItem} from "../models/task-board-item";
import {BoardItemService} from "app/tracker/services/board-item.service";
import {TaskService} from "./task.service";
import {Observable} from "rxjs/Observable";
import * as moment from 'moment/moment';
import * as _ from 'lodash';
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

    return boardItem;
  }

  boardItemStatusProvider(boardItem: TaskBoardItem, status: string) {
    let lastTimeLog = this.getLastTimeLog(boardItem);

    if (lastTimeLog && lastTimeLog['status'] == status) {
      return;
    } else if (status === 'accepted') {
      if (lastTimeLog['status'] == 'in progress') {
        boardItem = this.addTimeLog(boardItem, '');
      }
    }

    boardItem = this.addTimeLog(boardItem, status);

    return this.boardItemService
      .update(boardItem)
      .flatMap(() => this.getBoardItemLastSpendTime(boardItem))
      .flatMap((time) => this.formatAndRoundTaskSpentTime(time))
      .flatMap((time) => {
        boardItem.item.spenttime = boardItem.item.spenttime + time;

        return this.taskService.updateTask(boardItem.item);
      });
  }

  getBoardItemSpendTime(boardItem: TaskBoardItem): Observable <Moment> {
    let spentTime = 0;
    let lastInProgress = null;
    let lastTimeLog = this.getLastTimeLog(boardItem);

    boardItem.timeLog.forEach(log => {
      if (log.status === 'in progress') {
        lastInProgress = log.time;
      } else if (log.status === '') {
        spentTime += log.time - lastInProgress;
      }
    });

    if (lastTimeLog && lastTimeLog['status'] === 'in progress') {
      spentTime += Date.now() - lastInProgress;
    }

    return Observable.of(moment(spentTime).utc());
  }

  getBoardItemLastSpendTime(boardItem: TaskBoardItem): Observable <Moment> {
    let spentTime = 0;

    let lastInProgressIndex = _.findLastIndex(boardItem.timeLog, (item: any) => item.status === 'in progress');
    let checkAfterInProgressItem = !!boardItem.timeLog[lastInProgressIndex + 1];

    if (lastInProgressIndex < 0 || !checkAfterInProgressItem) {
      return Observable.of(moment(spentTime).utc());
    }

    spentTime = boardItem.timeLog[lastInProgressIndex + 1].time - boardItem.timeLog[lastInProgressIndex].time;
    return Observable.of(moment(spentTime).utc());
  }

  formatAndRoundTaskSpentTime(time): Observable <number> {
    let spentTime = moment.duration(time.format('HH:mm:ss')).asHours();
    let roundedSpentTime = Math.floor(spentTime * 1000) / 1000;

    return Observable.of(roundedSpentTime);
  }

  getLastTimeLog(boardItem) {
    if (!boardItem || !boardItem.timeLog || !boardItem.timeLog.length) {
      return null;
    }

    return _.last(boardItem.timeLog);
  }

  getLastStatus(boardItem) {
    let item = this.getLastTimeLog(boardItem);
    return item ? item['status'] : '';
  }
}
