import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {BasketResource} from "../resources/basket.resource";
import {User} from "../../user/models/user";
import {UserService} from "../../user/services/user.service";
import {TaskBoard} from "../models/task-board";
import {BehaviorSubject} from "rxjs";
import {TaskBoardItem} from "../models/task-board-item";
import {BoardItemService} from "./board-item.service";
import {BoardService} from "./board.service";


@Injectable()
export class BasketService {
  constructor(private basketResource: BasketResource,
              private userService: UserService,
              private  boardItemService: BoardItemService,
              private boardService: BoardService) {
    this.getUser();
    this.basket$
      .subscribe((basket) => this.basket = basket);
  }

  basketList$: BehaviorSubject<TaskBoardItem[]> = new BehaviorSubject<TaskBoardItem[]>(null);
  basket$: BehaviorSubject<TaskBoard> = new BehaviorSubject<TaskBoard>(null);
  basket: TaskBoard | null;

  activeBoardItem$: BehaviorSubject<TaskBoardItem> = new BehaviorSubject<TaskBoardItem>(null);
  user: User;

  getUser(): void {
    this.userService.get()
      .subscribe((user) => {
        this.user = user;
      })
  }

  setBasket(basket): void {
    this.basket$.next(basket);
  }

  getBasket(): Observable<TaskBoard> {
    return this.basketResource.get({userId: this.user._id})
      .$observable
  }

  createBasket(): Observable<TaskBoard> {
    return this.basketResource.create()
      .$observable
      .map((basket) => {
        this.setBasket(basket);
        return basket;
      })
  }

  updateBasket(basket: TaskBoard): Observable<TaskBoard> {
    return this.basketResource.update(basket, {basketId: basket._id})
      .$observable
      .map((basket) => {
        this.setBasket(basket);
        return basket;
      })
  }

  get(): Observable<TaskBoard> {
    if (this.basket) {
      return Observable.of(this.basket);
    }
    return this.getBasket()
      .map((basket) => {
        this.setBasket(basket);
        return basket;
      })
  }

  setBasketList() {
    this.boardItemService.getBoardItemsByBoardId(this.basket._id)
      .subscribe((boardItems) => {
        this.basketList$.next(boardItems);
        this.activeBoardItem$.next(this.getActiveBoardItem(boardItems));
      })
  }

//TODO @@@ira maybe change on observable and get err in copm
  getBasketMetrics(): void {
    this.boardService.getboardMetrics(this.basket._id)
      .subscribe((basket) => {
          this.setBasket(basket);
          this.setBasketList();
        },
        (err) => console.log('err', err))
  }

  //  TODO rename method and url - it's not a history, just boards
  getBasketHistory(query: any): Observable<TaskBoard[]> {
    return this.basketResource.getBasketHistory({userId: this.user._id, query: query})
      .$observable
  }

  getBaskets(query: any): Observable<TaskBoard[]> {
    return this.basketResource.getBaskets({query: query})
      .$observable
  }

  getActiveBoardItem(boardItems: TaskBoardItem[]): TaskBoardItem {
    return boardItems.filter((item) => item.timeLog[item.timeLog.length - 1])
      .find((item) => item.timeLog[item.timeLog.length - 1].status === 'in progress')
  }

}

