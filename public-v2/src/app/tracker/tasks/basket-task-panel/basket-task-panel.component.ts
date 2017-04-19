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

}
