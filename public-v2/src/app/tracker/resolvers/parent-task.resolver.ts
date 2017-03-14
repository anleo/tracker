import {Resolve, ActivatedRouteSnapshot, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';

import {TaskService} from "../services/task.service";
import {Task} from "../models/task";
import {CurrentTaskService} from "../services/current-task.service";

@Injectable()
export class ParentTaskResolver implements Resolve<any> {
  constructor(private taskService: TaskService,
              private currentTaskService: CurrentTaskService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Task> {
    let taskId = route.params['taskId'] || route.parent.params['taskId'] || null;

    return this.taskService
      .getParentByTaskId(taskId)
      .map((task) => {
        this.currentTaskService.parentTask$.next(task);
        return task;
      })
      .catch((err: any) => {
        this.router.navigate(['/app/tasks']);
        return Observable.of(null);
      });
  }
}
