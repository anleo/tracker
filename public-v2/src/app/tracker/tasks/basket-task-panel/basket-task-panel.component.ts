import {Component, OnInit, Input} from '@angular/core';

import {Task} from '../../models/task'
import {TaskService} from "../../services/task.service";
import {BoardItemService} from "../../services/board-item.service";
import {BasketService} from "../../services/basket.service";
import {TaskBoardItem} from "../../models/task-board-item";
import {Observable} from "rxjs";

import * as moment from 'moment/moment';

@Component({
  selector: 'basket-task-panel',
  templateUrl: 'basket-task-panel.component.html'
})
export class BasketTaskPanelComponent implements OnInit {
  @Input() boardItem: TaskBoardItem = null;
  @Input() pointCost: number = null;
  task: Task;
  approximateTime: string = null;
//TODO @@@dr rethink it
  boardItemSpentTimeTimestamp;
  timer$ = Observable.timer(1000, 1000);
  timerSubscription;
  spendTime;

  constructor(private taskService: TaskService,
              private boardItemService: BoardItemService,
              private basketService: BasketService) {
  }

  ngOnInit() {
    this.task = this.boardItem.item;
    if (this.task.simple) {
      this.calculateApproximateTime();
    }

    this.countTaskSpentTime(this.boardItem);

    if (this.boardItem.item.status === 'in progress') {
      this.startTimer();
    }
  }

  edit(task: Task) {
    this.taskService.setEditTaskModal(task);
  }

  remove(boardItem: TaskBoardItem) {
    this.boardItemService.remove(boardItem)
      .subscribe(() => {
          this.basketService.getBasketMetrics();
        },
        (err) => {
          console.log('err', err);
        })
  }

  calculateApproximateTime(): void {
    this.approximateTime = this.pointCost ? (this.task.points * this.pointCost).toFixed(2) : null;
  }

  start(boardItem) {
    console.log('start');
    this.boardItemStatusProvider(boardItem, 'in progress');
    this.startTimer();
  }

  pause(boardItem) {
    console.log('pause');
    this.boardItemStatusProvider(boardItem, '');

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe()
    }
  }

  accept(boardItem) {
    this.boardItemStatusProvider(boardItem, 'accepted');

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe()
    }
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

  //TODO @@@dr Maybe move to service?
  boardItemStatusProvider(boardItem: TaskBoardItem, status: string) {

    if (boardItem.item.status == status) {
      return;
    } else if (status === 'accepted') {
      if (boardItem.item.status == 'in progress') {
        boardItem = this.addTimeLog(boardItem, '');
      }
    }

    boardItem = this.addTimeLog(boardItem, status);

    this.boardItemService
      .update(boardItem)
      .subscribe(() => {
        this.saveSpentTime(boardItem)
      })
  }

  countTaskSpentTime(boardItem: TaskBoardItem) {
    this.boardItemService.getBoardItemSpendTime(boardItem)
      .subscribe((time) => {
        this.boardItemSpentTimeTimestamp = time;
        this.spendTime = time.format('HH:mm:ss');

      });
  }

  startTimer() {
    this.timerSubscription = this.timer$
      .subscribe(timer => {
        this.spendTime = this.boardItemSpentTimeTimestamp.add(1, 'second').format('HH:mm:ss');
      });
  }

  calculateTaskSpentTime(time): Observable <number> {
    let spentTime = moment.duration(time.format('HH:mm:ss')).asHours();
    console.log('spentTime', spentTime);
    let roundedSpentTime = Math.floor(spentTime * 1000) / 1000;
    console.log('roundedSpentTime', roundedSpentTime);
    return Observable.of(roundedSpentTime);
  }

  saveSpentTime(boardItem) {
    this.boardItemService.getBoardItemLastSpendTime(boardItem)
      .subscribe((time) => {
        this.calculateTaskSpentTime(time)
          .subscribe((time) => {
            boardItem.item.spenttime = boardItem.item.spenttime + time;

            console.log('this.task.spenttime', boardItem.item.spenttime);
            this.taskService.updateTask(boardItem.item)
              .subscribe((task) => {
                console.log('task.status', task.status);
                this.task = task;
                this.countTaskSpentTime(boardItem)
              });
          });
      });
  }

}
