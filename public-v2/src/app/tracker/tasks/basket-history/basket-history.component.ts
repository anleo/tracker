import {Component, OnInit} from '@angular/core';
import {TaskBoard} from "../../models/task-board";
import {BasketService} from "../../services/basket.service";
import {Location} from "@angular/common";

@Component({
  selector: 'basket-history',
  templateUrl: './basket-history.component.html',
})

export class BasketHistoryComponent implements OnInit {
  baskets: TaskBoard[] = [];
  showBasket: string = null;

  constructor(private basketService: BasketService,
              private location: Location) {
  }

  ngOnInit() {
    this.basketService.getBasketHistory()
      .subscribe((baskets) => {
        this.baskets = baskets;
      })
  }

  show(basketId): void {
    this.showBasket = basketId;
  }

  hide(): void {
    this.showBasket = null;
  }

  back(): void {
    this.location.back();
  }

}
