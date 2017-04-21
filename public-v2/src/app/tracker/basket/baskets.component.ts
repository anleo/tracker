import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";

import * as moment from 'moment/moment';

import {TaskBoard} from "../models/task-board";
import {BasketService} from "../services/basket.service";

@Component({
  selector: 'baskets',
  templateUrl: './baskets.component.html',
})

export class BasketsComponent implements OnInit {
  baskets: TaskBoard[] = [];


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

  back(): void {
    this.location.back();
  }

}
