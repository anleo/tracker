import {Component, OnInit, Input, OnChanges, SimpleChange} from '@angular/core';

import {Task} from '../../models/task'
import {TaskService} from "../../services/task.service";
import {BoardItemService} from "../../services/board-item.service";
import {BasketService} from "../../services/basket.service";
import {TaskBoardItem} from "../../models/task-board-item";
import {Observable} from "rxjs";
import {BoardItemSpentTimeService} from "../../services/board-item-spent-time.service";

@Component({
  selector: 'basket-current-task',
  templateUrl: 'basket-current-task.component.html'
})
export class BasketCurrentTaskComponent implements OnInit, OnChanges {
  @Input() boardItem: TaskBoardItem = null;
  task: Task;

//TODO @@@dr rethink it
  boardItemSpentTimeTimestamp;
  timer$ = Observable.timer(1000, 1000);
  timerSubscription;
  spendTime;

  constructor(private taskService: TaskService,
              private boardItemService: BoardItemService,
              private basketService: BasketService,
              private boardItemSpentTimeService: BoardItemSpentTimeService) {
  }

  ngOnChanges(changes: { [boardItem: string]: SimpleChange }): void {
    let prevValue = changes['boardItem'].previousValue;
    let currValue = changes['boardItem'].currentValue;

    if (prevValue._id && prevValue.item.status === 'in progress') {
      this.pause(prevValue);
    }

    this.task = currValue.item;

    this.countTaskSpentTime(currValue);
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

  start(boardItem) {
    this.boardItemSpentTimeService
      .boardItemStatusProvider(boardItem, 'in progress')
      .subscribe(() => {
        this.countTaskSpentTime(boardItem);
        this.startTimer();
      });
  }

  pause(boardItem) {
    this.boardItemSpentTimeService
      .boardItemStatusProvider(boardItem, '')
      .subscribe(() => {
        this.countTaskSpentTime(boardItem);
      });

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe()
    }
  }

  accept(boardItem) {
    this.boardItemSpentTimeService
      .boardItemStatusProvider(boardItem, 'accepted')
      .subscribe(() => {
        this.countTaskSpentTime(boardItem);
      });

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe()
    }
  }

  countTaskSpentTime(boardItem: TaskBoardItem) {
    this.boardItemSpentTimeService.getBoardItemSpendTime(boardItem)
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
