import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";

import * as moment from 'moment/moment';

import {TaskBoard} from "../models/task-board";
import {BasketService} from "../services/basket.service";
import {UserService} from "../../user/services/user.service";
import {User} from "../../user/models/user";

@Component({
  selector: 'baskets',
  templateUrl: './baskets.component.html',
})

export class BasketsComponent implements OnInit {
  baskets: TaskBoard[] = [];
  developers: Array<{id: string, text: string}> = [];
  selectedDevelopers: Array<{id: string, text: string}> = [];

  date: Date = new Date();
  today: Date = new Date();
  showDatePicker: boolean = false;

  constructor(private basketService: BasketService,
              private userService: UserService,
              private location: Location) {
  }

  ngOnInit() {
    this.userService
      .getUsersByProjectsTeams()
      .map(users => this.prepareUsers(users))
      .subscribe((users) => this.developers = users);

    this.userService.get()
      .map(user => this.prepareUsers([user]))
      .map(user => this.selectedDevelopers = user)
      .subscribe(() => this.getBaskets(this.today, this.selectedDevelopers));
  }

  getBaskets(date, users): void {
    let usersIds = users.map((user) => user.id);

    this.basketService
      .getBaskets({
        date: this.prepareDate(date),
        users: usersIds
      })
      .subscribe((baskets) => this.baskets = baskets);
  }

  toggleDatePicker(): void {
    this.showDatePicker = !this.showDatePicker;
  }

  onClose(): void {
    this.showDatePicker = false;
  }

  onChangeDate(date): void {
    this.showDatePicker = false;
    this.date = date;
    date = this.prepareDate(date);

    this.getBaskets(date, this.selectedDevelopers);
  }

  onChangeDeveloper(developer): void {
    this.setDeveloper(developer);
    this.getBaskets(this.prepareDate(this.date), this.selectedDevelopers);
  }

  private setDeveloper(developer) {
    this.selectedDevelopers = [developer];
  }

  private prepareDate(date): string {
    let currentTime = moment(this.today).format('hh:mm:ss');

    date = date.toString()
      .replace(/[0-9]{2}:[0-9]{2}:[0-9]{2}/g, currentTime);

    return date;
  }

  private prepareUsers(users: User[]): Array<{id: string, text: string}> {
    let userList = [];
    users.forEach((user) => userList.push({id: user._id, text: user.name}));

    return userList;
  }

  back(): void {
    this.location.back();
  }

}
