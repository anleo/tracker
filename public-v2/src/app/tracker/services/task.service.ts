import {Injectable} from '@angular/core';
import {TaskResource} from "../resources/tasks.resource";

import {Observable} from 'rxjs/Observable';
import {Task} from '../models/task';

@Injectable()
export class TaskService {
  constructor(private taskResource: TaskResource) {
  }

  getTasks(): Observable<Task[]> {
    return this.taskResource.getTasks()
      .$observable
      .map((tasks: Task[]) => {
        return tasks;
      })
      .catch((err) => {
        return Observable.throw(err);
      });
  }

  saveTask(task: Task): Observable<Task> {
    return this.taskResource.save(task)
      .$observable
      .map((task: Task) => {
        return task;
      })
      .catch((err) => {
        return Observable.throw(err);
      });
  }

  updateTask(task: Task): Observable<Task> {
    return this.taskResource.update(task, {taskId: task._id})
      .$observable
      .map((task) => {
        return task;
      })
      .catch((err) => {
        return Observable.throw(err);
      });
  }

  save(task: Task): Observable<Task> {
    return task && task._id ? this.updateTask(task) : this.saveTask(task);
  }

  getReportByDate(date: string): Observable <any> {
    return this.taskResource
      .getReportByDate({date: date})
      .$observable
      .catch((err) => {
        return Observable.throw(err);
      });
  }
}

