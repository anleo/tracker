import {Injectable} from '@angular/core';
import {TaskResource} from "../resources/tasks.resource";

import {Observable} from 'rxjs/Observable';
import {Task} from '../models/task';

@Injectable()
export class TaskService {
  constructor(private taskResource: TaskResource) {
  }

  getChildrenTasks(taskId: string): Observable<Task[]> {
    return this.taskResource.getChildrenTasks({}, {taskId: taskId})
      .$observable
      .map((tasks: Task[]) => {
        return tasks;
      })
      .catch((err) => {
        return Observable.throw(err);
      });
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

  getTask(taskId: string): Observable<Task> {
    return this.taskResource.getTask({}, {taskId: taskId})
      .$observable
      .map((task: Task) => {
        return task;
      })
      .catch((err) => {
        return Observable.throw(err);
      });
  }

  getRoot(taskId: string): Observable<Task> {
    return this.taskResource.getRoot({}, {taskId: taskId})
      .$observable
      .map((task: Task) => {
        return task;
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

  saveChildTask(task: Task): Observable<Task> {
    return task && task._id ?
      this.updateTask(task) :

      this.taskResource.saveChildTask(task, {taskId: task.parentTaskId})
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
}

