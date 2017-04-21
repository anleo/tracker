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
    return (boardItem.timeLog && boardItem.timeLog.length) ? true : false;
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
      .flatMap(() => {
        return this.getBoardItemLastSpendTime(boardItem)
      })
      .flatMap((time) => {
        console.log(time)
        return this.formatTaskSpentTime(time)
      })
      .flatMap((time) => {
        console.log('this.task.spenttime', boardItem.item.spenttime);
        boardItem.item.spenttime = boardItem.item.spenttime + time;
        console.log('this.task.spenttime', boardItem.item.spenttime);

        return this.taskService.updateTask(boardItem.item);
      });
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

  getBoardItemLastSpendTime(boardItem: TaskBoardItem): Observable <Moment> {
    let spentTime = 0;
    let timeLogLength = boardItem.timeLog.length;

    if (timeLogLength < 2) {
      return Observable.of(moment(spentTime).utc());
    }

    spentTime = boardItem.timeLog[timeLogLength - 1].time - boardItem.timeLog[timeLogLength - 2].time;
    return Observable.of(moment(spentTime).utc());
  }

  formatTaskSpentTime(time): Observable <number> {
    let spentTime = moment.duration(time.format('HH:mm:ss')).asHours();
    console.log('spentTime', spentTime);
    let roundedSpentTime = Math.floor(spentTime * 1000) / 1000;
    console.log('roundedSpentTime', roundedSpentTime);
    return Observable.of(roundedSpentTime);
  }


  // saveSpentTime(boardItem) {
  //   this.boardItemService.getBoardItemLastSpendTime(boardItem)
  //     .subscribe((time) => {
  //       this.formatTaskSpentTime(time)
  //         .subscribe((time) => {
  //           boardItem.item.spenttime = boardItem.item.spenttime + time;
  //
  //           console.log('this.task.spenttime', boardItem.item.spenttime);
  //           this.taskService.updateTask(boardItem.item)
  //             .subscribe((task) => {
  //               console.log('task.status', task.status);
  //               this.task = task;
  //               this.countTaskSpentTime(boardItem)
  //             });
  //         });
  //     });
  // }
}
