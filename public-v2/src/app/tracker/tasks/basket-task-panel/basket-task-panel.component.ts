import {Component, OnInit, Input} from '@angular/core';

import {Task} from '../../models/task'
import {TaskService} from "../../services/task.service";
import {BoardItemService} from "../../services/board-item.service";
import {BasketService} from "../../services/basket.service";
import {TaskBoardItem} from "../../models/task-board-item";
import {BoardService} from "../../services/board.service";

@Component({
  selector: 'basket-task-panel',
  templateUrl: 'basket-task-panel.component.html'
})
export class BasketTaskPanelComponent implements OnInit {
  @Input() boardItem: TaskBoardItem = null;
  @Input() pointCost: number = null;
  task: Task;
  showBasket: boolean = true;
  approximateTime: string = null;

  constructor(private taskService: TaskService,
              private  boardItemService: BoardItemService,
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

  moveToBasket(task: Task) {
    this.basketService.get()
      .subscribe((board) => {

        let boardItem = new TaskBoardItem();
        boardItem.board = board._id;
        boardItem.item = task._id;
        boardItem.type = "task";
        this.boardItemService.save(boardItem)
          .subscribe((response) => {
              this.showBasket = false;
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


  start(boardItem) {
    console.log('boardItem', boardItem);
  }

  calculateApproximateTime(): void {
    this.approximateTime = this.pointCost ? (this.task.points * this.pointCost).toFixed(2) : null;
  }

  pause(boardItem) {
  }

  accept(boardItem) {
  }

}
