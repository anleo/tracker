import {Component, OnInit} from '@angular/core';

import {BasketService} from "../../services/basket.service";
import {TaskBoard} from "../../models/task-board";
import {TaskBoardItem} from "../../models/task-board-item";
import {TaskService} from "../../services/task.service";
import {TaskWithStatus} from "../../models/task-with-status";
import {BoardItemService} from "../../services/board-item.service";

@Component({
  selector: '[basket]',
  templateUrl: './basket.component.html'
})
export class BasketComponent implements OnInit {

  taskItems: TaskBoardItem[] = [];
  showBasket: boolean = false;
  editMode: boolean = false;
  basket: TaskBoard;


  constructor(private basketService: BasketService,
              private taskService: TaskService,
              private boardItemService: BoardItemService) {

    this.basketService.basketList$
      .subscribe((taskItems) => this.taskItems = taskItems)

    this.taskService.editTaskUpdated$
      .subscribe((taskWithStatus: TaskWithStatus) => this.actionProvider(taskWithStatus));
  }

  ngOnInit() {
    this.getBasket();
  }

  toggleBasket() {
    this.showBasket = !this.showBasket;
  }

  getBasket() {
    this.basketService.get()
      .subscribe((basket) => {
        this.basket = basket;
        this.basketService.setBasketList();
      })
  }

  actionProvider(taskWithStatus: TaskWithStatus): void | boolean {
    if (!taskWithStatus) {
      return false;
    }

    if (taskWithStatus.status === 'update') {
      this.basketService.setBasketList();
    } else if (taskWithStatus.status === 'remove') {
      this.onRemove(taskWithStatus);
    }
  }

  onRemove(taskWithStatus: TaskWithStatus) {
    this.taskItems.filter((boardItem) => {
      if (boardItem.item._id == taskWithStatus.task._id) {
        this.boardItemService.remove(boardItem);
      }
    })
  }


}
