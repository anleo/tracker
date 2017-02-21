import {Injectable, Injector} from '@angular/core';
import {RequestMethod, Http} from '@angular/http';

import {Resource, ResourceParams, ResourceAction, ResourceMethod, ResourceMethodStrict} from 'ng2-resource-rest';

import {Task} from '../models/task';
import {User} from "../../user/models/user";

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

  @ResourceAction({
    path: '/{!taskId}/tasks',
    method: RequestMethod.Post
  })
  saveChildTask: ResourceMethodStrict<Task, {taskId: string}, Task>;

  @ResourceAction({
    path: '/{!taskId}',
    method: RequestMethod.Put
  })
  update: ResourceMethodStrict<Task, {taskId: string}, Task>;

  @ResourceAction({
    path: '/{!taskId}',
    method: RequestMethod.Delete
  })
  remove: ResourceMethod<{taskId: string}, null>;

  @ResourceAction({
    path: '/',
    isArray: true
  })
  getTasks: ResourceMethod<any, Task[]>;

  @ResourceAction({
    path: '/{!taskId}'
  })
  getTask: ResourceMethodStrict<any, {taskId: string}, Task>;

  @ResourceAction({
    path: '/{!taskId}/root'
  })
  getRoot: ResourceMethodStrict<any, {taskId: string}, Task>;

  @ResourceAction({
    path: '/{!taskId}/tasks',
    isArray: true
  })
  getChildrenTasks: ResourceMethodStrict<any,  {taskId: string}, Task[]>;

  @ResourceAction({
    path: '/report/{!date}',
    isArray: true
  })
  getTaskReportByDate: ResourceMethod<{date: string}, any>;

  @ResourceAction({
    path: '/{!taskId}/team',
    isArray: true
  })
  getTaskTeam: ResourceMethod<{taskId: string}, User[]>;

  @ResourceAction({
    path: '/{!taskId}/tags/tagsList',
    isArray: true
  })
  getTags: ResourceMethod<{taskId: string}, string[]>;
}
