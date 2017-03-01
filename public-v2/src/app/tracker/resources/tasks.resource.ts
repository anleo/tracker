import {Injectable, Injector} from '@angular/core';
import {RequestMethod, Http} from '@angular/http';

import {Resource, ResourceParams, ResourceAction, ResourceMethod, ResourceMethodStrict} from 'ng2-resource-rest';

import {Task} from '../models/task';
import {User} from "../../user/models/user";
import {HistoryMessage} from "../models/history-message";

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

  @ResourceAction({
    path: '/{!taskId}/move',
    isArray: true
  })
  getTasksForMove: ResourceMethod<{taskId: string}, Task[]>;

  @ResourceAction({
    path: '/{!taskId}/move/{!toTaskId}',
    method: RequestMethod.Put
  })
  moveTask: ResourceMethod<{taskId: string, toTaskId: string}, Task>;

  @ResourceAction({
    path: '/{!taskId}/history',
    isArray: true
  })
  getTaskHistory: ResourceMethod<{taskId: string}, HistoryMessage[]>;

  @ResourceAction({
    path: '/{!taskId}/history/comments',
    method: RequestMethod.Post
  })
  createCommnent: ResourceMethodStrict<HistoryMessage, {taskId: string}, HistoryMessage>;

  @ResourceAction({
    url: '/api/users/{!userId}/tasks',
    isArray: true
  })
  getUserTasks: ResourceMethod<{userId: string}, Task[]>;

  @ResourceAction({
    path: '/{!taskId}/archive',
    isArray: true
  })
  getArchivedTasks: ResourceMethod<{taskId: string}, Task[]>;

  @ResourceAction({
    path: '/archived',
    isArray: true
  })
  getArchivedProjects: ResourceMethod<any, Task[]>;

  @ResourceAction({
    method: RequestMethod.Delete,
    path: '/{!taskId}/files/{!fileId}'
  })
  deleteTaskFile: ResourceMethod<{taskId: string, fileId: string}, any>;

}
