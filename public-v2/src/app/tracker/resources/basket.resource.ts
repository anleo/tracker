import {Injectable, Injector} from '@angular/core';
import {RequestMethod, Http} from '@angular/http';

import {Resource, ResourceParams, ResourceAction, ResourceMethodStrict, ResourceMethod} from 'ng2-resource-rest';
import {TaskBoard} from "../models/task-board";


@Injectable()
@ResourceParams({
  url: '/api/baskets'
})

export class BasketResource extends Resource {
  constructor(http: Http, injector: Injector) {
    super(http, injector);
  }

  @ResourceAction({
    path: '/{!userId}',
    method: RequestMethod.Get
  })
  get: ResourceMethod<{userId: string}, TaskBoard>;

  @ResourceAction({
    path: '/{!basketId}',
    method: RequestMethod.Put
  })
  update: ResourceMethodStrict<TaskBoard,{basketId: string}, TaskBoard>;

  @ResourceAction({
    path: '/',
    method: RequestMethod.Post
  })
  create: ResourceMethod<any, TaskBoard>;

  @ResourceAction({
    path: '/{!userId}/history',
    params: {"query": "query"},
    isArray: true
  })
    //  TODO rename method and url - it's not a history, just boards
  getBasketHistory: ResourceMethod<{userId: string, query: any}, TaskBoard[]>;

}
