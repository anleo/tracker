import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {BasketResource} from "../resources/basket.resource";
import {User} from "../../user/models/user";
import {UserService} from "../../user/services/user.service";
import {TaskBoard} from "../models/task-board";
import {BehaviorSubject} from "rxjs";
import {TaskBoardItem} from "../models/task-board-item";
import {BoardItemService} from "./board-item.service";


@Injectable()
export class BasketService {
  constructor(private basketResource: BasketResource,
              private userService: UserService,
              private  boardItemService: BoardItemService) {
    this.getUser();
  }

  basketList$: BehaviorSubject<TaskBoardItem[]> = new BehaviorSubject<TaskBoardItem[]>(null);
  basket: TaskBoard | null;
  user: User;

  getUser(): void {
    this.userService.get()
      .subscribe((user) => {
        this.user = user;
      })
  }

  getBasket(): Observable<TaskBoard> {
    return this.basketResource.get({userId: this.user._id})
      .$observable
  }

  createBasket(): Observable<TaskBoard> {
    return this.basketResource.create()
      .$observable
      .map((basket) => {
        return this.basket = basket;
      })
  }

  updateBasket(basket: TaskBoard): Observable<TaskBoard> {
    return this.basketResource.update(basket, {basketId: basket._id})
      .$observable
  }

  get(): Observable<TaskBoard> {
    if (this.basket) {
      return Observable.of(this.basket);
    }
    return this.getBasket()
      .map((basket) => {
        return this.basket = basket;
      })
  }

  setBasketList() {
    this.boardItemService.getBoardItemsByBoardId(this.basket._id)
      .subscribe((boardItems) => {
        this.basketList$.next(boardItems);
      })
  }

}

