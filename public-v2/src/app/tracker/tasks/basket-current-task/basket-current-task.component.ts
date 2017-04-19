import {Component, OnInit, Input, OnChanges, SimpleChange} from '@angular/core';

import {Task} from '../../models/task'
import {TaskService} from "../../services/task.service";
import {BoardItemService} from "../../services/board-item.service";
import {BasketService} from "../../services/basket.service";
import {TaskBoardItem} from "../../models/task-board-item";
import {Observable} from "rxjs";

@Component({
  selector: 'basket-current-task',
  templateUrl: 'basket-current-task.component.html'
})
export class BasketCurrentTaskComponent implements OnInit, OnChanges {
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

  ngOnChanges(changes: { [boardItem: string]: SimpleChange }): void {
    if (Object.keys(changes['boardItem'].previousValue).length > 1
      && changes['boardItem'].previousValue.item.status === 'in progress') {

      this.pause(changes['boardItem'].previousValue);
    }

    this.task = changes['boardItem'].currentValue.item;

    this.countTaskSpentTime(changes['boardItem'].currentValue);
  }

  ngOnInit() {
    if (!this.boardItem) {
      return;
    }
    this.task = this.boardItem.item;

    this.countTaskSpentTime(this.boardItem);
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
    this.boardItemStatusProvider(boardItem, 'in progress');
    this.startTimer();
  }

  pause(boardItem) {
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
      .switchMap(result => this.taskService.updateTask(boardItem.item))
      .subscribe((task) => {
        this.countTaskSpentTime(boardItem)
      });
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

//TODO @@@dr move it to component or directive
  public setLabelClass(): string {
    let className = 'label-info';

    if (this.task.status === 'accepted') {
      className = 'label-success';
    }

    if (this.task.status === 'in progress') {
      className = 'label-warning'
    }

    return className;
  }

}
