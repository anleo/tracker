import {Injectable, Injector} from '@angular/core';
import {RequestMethod, Http} from '@angular/http';

import {Resource, ResourceParams, ResourceAction, ResourceMethodStrict} from 'ng2-resource-rest';

import {TaskBoardItem} from '../models/task-board-item';

@Injectable()
@ResourceParams({
  url: '/api/boards/{!boardId}/boardItems'
})

export class BoardItemResource extends Resource {
  constructor(http: Http, injector: Injector) {
    super(http, injector);
  }

  @ResourceAction({
    path: '/',
    method: RequestMethod.Post
  })
  save: ResourceMethodStrict<TaskBoardItem, {boardId: string}, TaskBoardItem>;

  @ResourceAction({
    url: '/api/projects/{!projectId}/boardItems/root',
    isArray: true,
    method: RequestMethod.Get
  })
  getRootBoardItemsByProject: ResourceMethodStrict<any, {projectId: string}, TaskBoardItem[]>;
}
