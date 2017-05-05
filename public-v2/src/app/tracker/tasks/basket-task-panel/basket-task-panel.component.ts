import {Component, OnInit, Input, Output} from '@angular/core';

import {Task} from '../../models/task'
import {TaskService} from "../../services/task.service";
import {BasketService} from "../../services/basket.service";
import {TaskBoardItem} from "../../models/task-board-item";
import {ToastService} from "../../../services/toast.service";
import {TaskComplexities} from "../components/complexity/task-complexities";
import {TaskComplexity} from "../../models/task-complexity";

@Component({
  selector: 'basket-task-panel',
  templateUrl: 'basket-task-panel.component.html'
})
export class BasketTaskPanelComponent implements OnInit {
  @Input() boardItem: TaskBoardItem = null;
  @Input() pointCost: number = null;
  task: Task;
  approximateTime: string = null;
  complexities: TaskComplexity[] = TaskComplexities;

  show: boolean = false;
  subTask: any = {};

  constructor(private taskService: TaskService,
              private basketService: BasketService,
              private toastService: ToastService) {
  }

  ngOnInit() {
    this.task = this.boardItem.item;
    if (this.task.simple) {
      this.calculateApproximateTime();
    }

    this.initSubTask();
  }

  edit(task: Task) {
    this.taskService.setEditTaskModal(task);
  }

  remove(boardItem: TaskBoardItem) {
    this.basketService.removeBasketItem(boardItem)
      .subscribe(
        () => this.basketService.getBasketMetrics(),
        (err) => console.log('err', err)
      );
  }

  calculateApproximateTime(): void {
    this.approximateTime = this.pointCost ? (this.task.points * this.pointCost).toFixed(2) : null;
  }

  start(boardItem) {
    this.basketService.setActiveBoardItem(boardItem);
  }

  addSubBoardItem() {
    if (!this.subTask.title.length) {
      this.toastService.error('Title is a required', 'Something was wrong');
    }

    this.subTask.parentTaskId = this.task._id;

    this.basketService.createAndAddTask(this.subTask, this.boardItem)
      .subscribe(() => {
        this.toastService.info('', 'Item was created');
        this.basketService.setBasketBoardItems();
        this.initSubTask();
      });
  }

  showForm() {
    this.show = !this.show;
  }

  private initSubTask() {
    if (this.task && this.task._id) {
      this.subTask.parentTaskId = this.task._id;
      this.subTask.title = '';
      this.subTask.complexity = 0;
    }
  }
}
