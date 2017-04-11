import {Injectable, Injector} from '@angular/core';
import {RequestMethod, Http} from '@angular/http';

import {Resource, ResourceParams, ResourceAction, ResourceMethodStrict} from 'ng2-resource-rest';

import {TaskBoard} from '../models/task-board';

@Injectable()
@ResourceParams({
  url: '/api/projects/{!projectId}/boards'
})

export class BoardResource extends Resource {
  constructor(http: Http, injector: Injector) {
    super(http, injector);
  }

  @ResourceAction({
    path: '/',
    method: RequestMethod.Post
  })
  save: ResourceMethodStrict<TaskBoard, {projectId: string}, TaskBoard>;

  @ResourceAction({
    path: '/',
    isArray: true
  })
  getBoards: ResourceMethodStrict<any, {projectId: string}, TaskBoard[]>;

  @ResourceAction({
    url: '/api/boards/{!boardId}'
  })
  getBoard: ResourceMethodStrict<any, {boardId: string}, TaskBoard>;
}
