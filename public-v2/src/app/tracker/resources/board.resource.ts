import {Injectable, Injector} from '@angular/core';
import {RequestMethod, Http} from '@angular/http';

import {Resource, ResourceParams, ResourceAction, ResourceMethodStrict, ResourceMethod} from 'ng2-resource-rest';

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
    path: '/{!boardId}',
    method: RequestMethod.Put
  })
  update: ResourceMethodStrict<TaskBoard, {projectId: string, boardId: string}, TaskBoard>;

  @ResourceAction({
    path: '/{!boardId}',
    method: RequestMethod.Delete
  })
  remove: ResourceMethod<{projectId: string, boardId: string}, null>;

  @ResourceAction({
    path: '/',
    isArray: true
  })
  getBoards: ResourceMethodStrict<any, {projectId: string}, TaskBoard[]>;

  @ResourceAction({
    url: '/api/boards/{!boardId}/metrics',
    method: RequestMethod.Put
  })
  getboardMetrics: ResourceMethod<{boardId: string}, TaskBoard>;

  @ResourceAction({
    url: '/api/boards/{!boardId}'
  })
  getBoard: ResourceMethod<{boardId: string}, TaskBoard>;
}
