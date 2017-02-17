import {Resolve, ActivatedRouteSnapshot, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';

import {TaskService} from "../services/task.service";
import {Task} from "../models/task";

@Injectable()
export class TaskResolver implements Resolve<any> {
  constructor(private taskService: TaskService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Task> {
    return this.taskService.getTask(route.params['taskId'])
      .catch((err: any) => {
        this.router.navigate(['/app/tasks']);
        return Observable.of(null);
      });
  }
}
