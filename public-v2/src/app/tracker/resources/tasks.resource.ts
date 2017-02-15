import {Injectable} from '@angular/core';
import {RequestMethod} from '@angular/http';

import {Injector} from '@angular/core';
import {Http} from '@angular/http';

import {Resource, ResourceParams, ResourceAction, ResourceMethod, ResourceMethodStrict} from 'ng2-resource-rest';

import {Task} from '../models/task';

@Injectable()
@ResourceParams({
  url: '/api/tasks'
})
export class TaskResource extends Resource {
  constructor(http: Http, injector: Injector) {
    super(http, injector);
  }

  @ResourceAction({
    method: RequestMethod.Post
  })
  save: ResourceMethod<Task, Task>;

  // @ResourceAction({
  //   path: '/{!postId}',
  //   method: RequestMethod.Delete
  // })
  // remove: ResourceMethod<{postId: string}, Post>;

  @ResourceAction({
    path: '/{!taskId}',
    method: RequestMethod.Put
  })
  update: ResourceMethodStrict<Task, {taskId: string}, Task>;

  @ResourceAction({
    path: '/',
    isArray: true
  })
  getTasks: ResourceMethod<any, Task[]>;

  // @ResourceAction({
  //   path: '/{!postId}'
  // })
  // getPost: ResourceMethod<{postId: string}, Post>;
}
