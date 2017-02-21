import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from "rxjs";

import {Task} from '../models/task';
import {TaskResource} from "../resources/tasks.resource";
import {User} from "../../user/models/user";

@Injectable()
export class TaskService {
  editTask: Task|null = null;
  editTask$: BehaviorSubject<Task> = new BehaviorSubject<Task>(null);

  constructor(private taskResource: TaskResource) {
    this.editTask$.subscribe((task) => {
      this.editTask = task;
    });
  }

  setEditTask(task: Task) {
    this.editTask$.next(task);
  }

  getChildrenTasks(taskId: string): Observable<Task[]> {
    return this.taskResource.getChildrenTasks({}, {taskId: taskId}).$observable;
  }

  getTasks(): Observable<Task[]> {
    return this.taskResource.getTasks().$observable;
  }

  getTask(taskId: string): Observable<Task> {
    return this.taskResource.getTask({}, {taskId: taskId}).$observable;
  }

  getRoot(taskId: string): Observable<Task> {
    return this.taskResource.getRoot({}, {taskId: taskId}).$observable;
  }

  saveTask(task: Task): Observable<Task> {
    return this.taskResource.save(task).$observable;
  }

  saveChildTask(task: Task): Observable<Task> {
    return task && task._id ?
      this.updateTask(task) :
      this.taskResource.saveChildTask(task, {taskId: task.parentTaskId}).$observable;
  }

  updateTask(task: Task): Observable<Task> {
    return this.taskResource.update(task, {taskId: task._id}).$observable;
  }

  remove(task: Task): Observable<any> {
    return this.taskResource.remove({taskId: task._id}).$observable;
  }

  save(task: Task): Observable<Task> {
    return task && task._id ? this.updateTask(task) : this.saveTask(task);
  }

  getTaskReportByDate(date: Date): Observable <Task[]> {
    return this.taskResource
      .getTaskReportByDate({date: date.toString()})
      .$observable
      .catch((err) => {
        return Observable.throw(err);
      });
  }

  getTaskTeam(taskId: string): Observable <User[]> {
    return this.taskResource
      .getTaskTeam({taskId: taskId})
      .$observable;
  }
}

