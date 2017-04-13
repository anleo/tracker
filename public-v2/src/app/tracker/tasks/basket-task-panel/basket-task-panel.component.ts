import {Component, OnInit, Input} from '@angular/core';

import {Task} from '../../models/task'
import {TaskService} from "../../services/task.service";
import {BoardItemService} from "../../services/board-item.service";
import {BasketService} from "../../services/basket.service";
import {TaskBoardItem} from "../../models/task-board-item";
import * as moment from 'moment/moment';
import {BoardService} from "../../services/board.service";

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
  taskSpentTime;

  constructor(private taskService: TaskService,
              private boardItemService: BoardItemService,
              private basketService: BasketService) {
  }

  ngOnInit() {
    this.task = this.boardItem.item;
    this.taskSpentTime = this.countTaskSpentTime(this.boardItem);
    if (this.task.simple) {
      this.calculateApproximateTime();
    }

  }

  edit(task: Task) {
    this.taskService.setEditTaskModal(task);
  }

  moveToBasket(task: Task) {
    this.basketService.get()
      .subscribe((board) => {

        let boardItem = new TaskBoardItem();
        boardItem.board = board._id;
        boardItem.item = task._id;
        boardItem.type = "task";
        this.boardItemService.save(boardItem)
          .subscribe((response) => {
              this.basketService.setBasketList();
            },
            (err) => {
              console.log('err', err);
            })
      })
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
    this.taskSpentTime = this.countTaskSpentTime(this.boardItem);
  }

  pause(boardItem) {
    this.boardItemStatusProvider(boardItem, '');
    this.taskSpentTime = this.countTaskSpentTime(this.boardItem);
  }

  accept(boardItem) {
    this.boardItemStatusProvider(boardItem, 'accepted');
    this.taskSpentTime = this.countTaskSpentTime(this.boardItem);
  }

  hasTimeLog(boardItem) {
    return (boardItem.timeLog && boardItem.timeLog.length) ? true : false;
  }

  //TODO @@@dr refact it
  addTimeLog(boardItem, status): TaskBoardItem {
    if (this.hasTimeLog(boardItem)) {
      boardItem.timeLog.push({
        status: status,
        time: Date.now()
      });
    } else {
      boardItem.timeLog = [{
        // status: boardItem.item.status,
        status: status,
        time: Date.now()
      }];
    }

    boardItem.item.status = status;

    return boardItem;
  }

  boardItemStatusProvider(boardItem, status) {
    if(boardItem.item.status == status) {
      return;
    }else if(status === 'accepted'){
      if (boardItem.item.status == 'in progress') {
        boardItem = this.addTimeLog(boardItem, '');
      }
    }

    boardItem = this.addTimeLog(boardItem, status);

    this.boardItemService.update(boardItem)
      .switchMap(result => this.taskService.updateTask(boardItem.item))
      .subscribe((task) => {
        this.task = task;
      })
  }

  //TODO @@@dr refact it
  countTaskSpentTime(boardItem){
    let spentTime = 0;
    let lastInProgress = null;

    boardItem.timeLog.forEach(log => {
      if(log.status === 'in progress' && !lastInProgress){
        lastInProgress = log.time;
      }else if(log.status === 'in progress' && lastInProgress){
        lastInProgress = log.time;
      }else if(log.status === ''){
        spentTime += log.time - lastInProgress;
      }
    });

    return moment(spentTime).utc().format("HH:mm:ss")
  }

}
