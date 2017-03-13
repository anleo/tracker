import {Resolve, ActivatedRouteSnapshot, Router} from '@angular/router';
import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Rx';

import {TaskService} from "../services/task.service";
import {Task} from "../models/task";
import {ROOT_TASKSERVICE} from "../../app.tokens";

@Injectable()
export class TaskResolver implements Resolve<any> {
  constructor(private taskService: TaskService,
              @Inject(ROOT_TASKSERVICE) private rootTaskService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Task> {
    let taskId = route.params['taskId'] || route.parent.params['taskId'] || null;

    return this.taskService
      .getTask(taskId)
      .map((task) => {
        this.taskService.task$.next(task);
        this.rootTaskService.task$.next(task);
        return task;
      })
      .catch((err: any) => {
        this.router.navigate(['/app/tasks']);
        return Observable.of(null);
      });
  }
}
