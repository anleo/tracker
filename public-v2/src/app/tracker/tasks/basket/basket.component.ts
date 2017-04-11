import {Component, OnInit} from '@angular/core';

import {Task} from '../../models/task';
import {TaskService} from "../../services/task.service";
import {CurrentTaskService} from "../../services/current-task.service";
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



  constructor(private taskService: TaskService,
              private basketService: BasketService) {
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
            console.log('basket', basket);
            this.basket = basket;
          })
  }

  getList() {
  }

  deleteTask() {
  }


}
