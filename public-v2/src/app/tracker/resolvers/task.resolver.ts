import {Resolve, ActivatedRouteSnapshot, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/switchMap'

import {TaskService} from "../services/task.service";
import {Task} from "../models/task";
import {CurrentTaskService} from "../services/current-task.service";

@Injectable()
export class TaskResolver implements Resolve<any> {
  constructor(private taskService: TaskService,
              private currentTaskService: CurrentTaskService) {
  }

  resolve(route: ActivatedRouteSnapshot): Promise<Task> {
    let taskId = route.params['taskId'] || route.parent.params['taskId'] || null;

    let root = null;
    let parent = null;
    let taskItem = null;

    return this.taskService.getTask(taskId).toPromise().then((task) => taskItem = task)
      .then(() => this.taskService.getRoot(taskId).toPromise().then((task) => root = task))
      .then(() => this.taskService.getParentByTaskId(taskId).toPromise().then((task) => parent = task))
      .then(() => {
        this.currentTaskService.task$.next(taskItem);
        this.currentTaskService.rootTask$.next(root);
        this.currentTaskService.parentTask$.next(parent);
      })
      .then(() => taskItem);
  }
}
