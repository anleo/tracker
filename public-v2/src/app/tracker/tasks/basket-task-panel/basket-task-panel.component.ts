import {Component, OnInit, Input, Output} from '@angular/core';

import {Task} from '../../models/task'
import {TaskService} from "../../services/task.service";
import {BoardItemService} from "../../services/board-item.service";
import {BasketService} from "../../services/basket.service";
import {TaskBoardItem} from "../../models/task-board-item";
import {Observable} from "rxjs";
import {EventEmitter} from "@angular/common/src/facade/async";

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
  @Output() selectedTask: EventEmitter<TaskBoardItem> = new EventEmitter();


  constructor(private taskService: TaskService,
              private boardItemService: BoardItemService,
              private basketService: BasketService) {
  }

  ngOnInit() {
    this.task = this.boardItem.item;
    if (this.task.simple) {
      this.calculateApproximateTime();
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
    this.selectedTask.emit(boardItem);
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
        this.task = task;
        this.countTaskSpentTime(boardItem)
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
}
