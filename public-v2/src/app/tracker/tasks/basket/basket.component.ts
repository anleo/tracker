import {Component, OnInit} from '@angular/core';

import {BasketService} from "../../services/basket.service";
import {TaskBoard} from "../../models/task-board";
import {TaskBoardItem} from "../../models/task-board-item";

@Component({
  selector: 'basket',
  templateUrl: './basket.component.html'
})
export class BasketComponent implements OnInit {

  taskItems: TaskBoardItem[] = [];
  showBasket: boolean = false;
  editMode: boolean = false;
  basket: TaskBoard;


  constructor(private basketService: BasketService) {
    this.basketService.basketList$
      .subscribe((taskItems) => {
        this.taskItems = taskItems;
      })
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


  deleteTask() {
  }


}
