import {Component, OnInit} from '@angular/core';

import {Task} from '../../models/task';
import {BasketService} from "../../services/basket.service";
import {TaskBoard} from "../../models/task-board";

@Component({
  selector: 'basket',
  templateUrl: './basket.component.html'
})
export class BasketComponent implements OnInit {

  tasks: Task[] = [];
  task: Task|null = null;

  showBasket: boolean = false;
  addTaskToggle: boolean = false;
  editMode: boolean = false;
  basket: TaskBoard;


  constructor(private basketService: BasketService) {
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

  getList() {
    this.basketService.basketList$
      .subscribe((basketItems) => {
        console.log('basketItems', basketItems);
      })

  }

  deleteTask() {
  }


}
