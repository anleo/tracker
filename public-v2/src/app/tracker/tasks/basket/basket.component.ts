import {Component, OnInit} from '@angular/core';

import {BasketService} from "../../services/basket.service";
import {TaskBoard} from "../../models/task-board";
import {TaskBoardItem} from "../../models/task-board-item";
import {TaskService} from "../../services/task.service";
import {TaskWithStatus} from "../../models/task-with-status";
import {BoardItemService} from "../../services/board-item.service";
import {DnDService} from "../../dnd/dnd.service";

import *as _ from 'lodash';
import {ToastService} from "../../../services/toast.service";
import {BasketBacklogService} from "../../services/basket-backlog.service";

@Component({
  selector: 'basket',
  templateUrl: './basket.component.html',
  providers: [DnDService]
})
export class BasketComponent implements OnInit {

  taskItems: TaskBoardItem[] = [];
  showBasket: boolean = false;
  backlogToggle: boolean;
  basket: TaskBoard;
  currentBoardItem: TaskBoardItem = null;

  constructor(private basketService: BasketService,
              private taskService: TaskService,
              private boardItemService: BoardItemService,
              private dndService: DnDService,
              private toastService: ToastService,
              private basketBacklogService: BasketBacklogService) {
  }

  ngOnInit() {
    this.getBasket();

    this.basketService.basketList$
      .subscribe((taskItems) => {
        this.taskItems = taskItems;

        if (this.taskItems) {
          this.taskItems = this.basketService.buildBoardItemsTree(taskItems);
        }
      });

    this.basketService.basket$
      .subscribe((basket) => this.basket = basket);

    this.taskService.editTaskUpdated$
      .subscribe((taskWithStatus: TaskWithStatus) => this.actionProvider(taskWithStatus));

    this.dndService.onDrop$
      .subscribe((dropData) => this.onDrop(dropData));

    this.basketBacklogService.backlogToggle$
      .subscribe((backlogToggle) => this.backlogToggle = backlogToggle);

    this.basketService.activeBoardItem$
      .subscribe((boardItem) => this.currentBoardItem = boardItem);
  }

  toggleBasket() {
    this.showBasket = !this.showBasket;
    this.basketBacklogService.basketToggle$.next(this.showBasket);
  }

  getBasket() {
    this.basketService.get()
      .subscribe(() => {
        this.basketService.setBasketBoardItems();
      })
  }

  clearBasket() {
    this.boardItemService.removeBoardItemByBoard(this.basket)
      .subscribe(() => {
          this.basketService.getBasketMetrics();
        },
        (err) => console.log("Err on clear basket", err))
  }

  actionProvider(taskWithStatus: TaskWithStatus): void | boolean {
    if (!taskWithStatus) {
      return false;
    }

    if (taskWithStatus.status === 'update') {
      this.basketService.getBasketMetrics();
    } else if (taskWithStatus.status === 'remove') {
      this.onRemove(taskWithStatus);
    }
  }

  onRemove(taskWithStatus: TaskWithStatus) {
    this.taskItems.filter((boardItem) => {
      if (boardItem.item._id == taskWithStatus.task._id) {
        this.boardItemService.remove(boardItem)
          .subscribe(() => {
            this.basketService.getBasketMetrics();
          })
      }
    })
  }

  finish(): void {
    this.basket.status = 'finished';
    this.basketService.updateBasket(this.basket)
      .subscribe(() => {
          this.basketService.createBasket()
            .map(() => this.toastService.info('Current basket was finished and created new basket'))
            .subscribe(
              () => this.basketService.setBasketBoardItems(),
              (err) => console.log('err', err)
            );
        },
        (err) => console.log('err', err))
  }

  save(): void {
    this.basketService.updateBasket(this.basket)
      .subscribe(() => {
          this.basketService.setBasketBoardItems();
        },
        (err) => console.log('err', err))
  }

  checkDropDataType(item) {
    if (item.type && item.type === 'board') {
      return false;
    }

    return true;
  }

  onModelChange() {
    this.save();
  }

  private onDrop(dropData) {
    if (!dropData.item) {
      return;
    }

    let item = dropData.item && dropData.item.item ? dropData.item.item : dropData.item;

    let newItem = {
      board: this.basket._id,
      item: item,
      type: item.simple ? 'task' : 'complex'
    };

    this.basketService
      .saveBoardItemToBasket(newItem)
      .subscribe(
        () => this.basketService.setBasketBoardItems(),
        (err) => this.toastService.error(JSON.parse(err._body).error.toString(), 'Something was wrong')
      );
  }

  onChangeStatus(event) {
    this.currentBoardItem = event;
  }
}
