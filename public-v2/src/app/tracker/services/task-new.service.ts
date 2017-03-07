import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from "rxjs";

import {Task} from '../models/task';
import {TaskResource} from "../resources/tasks.resource";

@Injectable()
export class TaskNewService {
  tasks: Task[] = [];

  constructor(private taskResource: TaskResource) {

  }

  getTasks(method: string, taskId: string|any): Observable<Task[]> {
    return this.taskResource[method]({taskId: taskId}).$observable;
  }

}

