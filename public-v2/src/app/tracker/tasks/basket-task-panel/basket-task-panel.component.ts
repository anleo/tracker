import {Component, OnInit, Input, Output} from '@angular/core';

import {Task} from '../../models/task'
import {TaskService} from "../../services/task.service";
import {BoardItemService} from "../../services/board-item.service";
import {BasketService} from "../../services/basket.service";
import {TaskBoardItem} from "../../models/task-board-item";
import {Observable} from "rxjs";
import {EventEmitter} from "@angular/common/src/facade/async";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'basket-task-panel',
  templateUrl: 'basket-task-panel.component.html'
})
export class BasketTaskPanelComponent implements OnInit {
  @Input() boardItem: TaskBoardItem = null;
  @Input() pointCost: number = null;

  @Output() selectedTask: EventEmitter<TaskBoardItem> = new EventEmitter();

  task: Task;
  approximateTime: string = null;
  show: boolean = false;
  subtask: any = {};

  constructor(private taskService: TaskService,
              private boardItemService: BoardItemService,
              private basketService: BasketService,
              private toastService: ToastService) {
  }

  ngOnInit() {
    this.task = this.boardItem.item;
    if (this.task.simple) {
      this.calculateApproximateTime();
    }

    this.initSubtask();
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
    this.basketService.setActiveBoardItem(boardItem);
  }

  save() {
    if (!this.subtask.title.length) {
      this.toastService.error('Title is a required', 'Something was wrong');
    }

    this.subtask.parentTaskId = this.task._id;
    this.taskService.saveChildTask(this.subtask)
      .subscribe(() => {
        this.toastService.info('', 'Item was created');
        this.initSubtask();
      });
  }

  showForm() {
    this.show = !this.show;
  }

  private initSubtask() {
    if (this.task && this.task._id) {
      this.subtask.parentTaskId = this.task._id;
      this.subtask.title = '';
    }
  }
}
