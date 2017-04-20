import {Component, OnInit} from '@angular/core';
import {TaskBoard} from "../../models/task-board";
import {BasketService} from "../../services/basket.service";
import {Location} from "@angular/common";
import * as moment from 'moment/moment';

@Component({
  selector: 'basket-history',
  templateUrl: './basket-history.component.html',
})

export class BasketHistoryComponent implements OnInit {
  baskets: TaskBoard[] = [];
  showBasket: string = null;

  date: Date = new Date();
  today: Date = new Date();
  showDatePicker: boolean = false;

  constructor(private basketService: BasketService,
              private location: Location) {
  }

  ngOnInit() {
    //  TODO rename method and url - it's not a history, just boards
    this.basketService
      .getBasketHistory({
        date: this.prepareDate(this.today)
      })
      .subscribe((baskets) => {
        this.baskets = baskets;
      })
  }

  toggleDatePicker(): void {
    this.showDatePicker = !this.showDatePicker;
  }

  onClose(): void {
    this.showDatePicker = false;
  }

  onChangeDate(date): void {
    this.date = date;
    date = this.prepareDate(date);

    //  TODO rename method and url - it's not a history, just boards
    this.basketService
      .getBasketHistory({
        date: date
      })
      .subscribe((baskets) => {
        this.baskets = baskets;
      });

    this.showDatePicker = false;
  }

  private prepareDate(date): string {
    let currentTime = moment(this.today).format('hh:mm:ss');

    date = date.toString()
      .replace(/[0-9]{2}:[0-9]{2}:[0-9]{2}/g, currentTime);

    return date;
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
