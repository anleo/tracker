import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from "rxjs";

import {Task} from '../models/task';
import {TaskResource} from "../resources/tasks.resource";
import {User} from "../../user/models/user";
import {FileResourse} from "../resources/file.resource";

@Injectable()
export class TaskService {
  editTask: Task|null = null;
  movedTask: Task|null = null;
  tasks: Task[]|null = null;

  editTask$: BehaviorSubject<Task> = new BehaviorSubject<Task>(null);
  editTaskClose$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  editTaskModal$: BehaviorSubject<Task> = new BehaviorSubject<Task>(null);
  tasks$: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>(null);
  taskMoved$: BehaviorSubject<Task> = new BehaviorSubject<Task>(null);

  constructor(private taskResource: TaskResource,
              private fileResource: FileResourse) {
    this.editTask$.subscribe((task) => this.editTask = task);

    this.editTaskModal$.subscribe((task) => this.editTask = task);

    this.tasks$.subscribe((tasks) => this.tasks = tasks);

    this.taskMoved$.subscribe(task => this.movedTask = task);

    this.editTaskClose$.subscribe();
  }

  setTasks(tasks: Task[]) {
    this.tasks$.next(tasks);
  }

  setEditTask(task: Task) {
    this.editTask$.next(task);
  }

  setEditTaskModal(task: Task) {
    this.editTaskModal$.next(task);
  }

  setMovedTask(task: Task) {
    this.taskMoved$.next(task);
  }

  getTags(task: Task): Observable<string[]> {
    return this.taskResource.getTags({taskId: task._id}).$observable;
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

  deleteFile(file: any, task: Task): Observable <any> {
    return this.fileResource.delete({taskId: task._id, fileId: file._id})
      .$observable;
  }

  getTasksForMove(taskId: string): Observable<Task[]> {
    return this.taskResource
      .getTasksForMove({taskId: taskId})
      .$observable;
  }

  moveTask(taskId: string, toTaskId: string): Observable <Task> {
    return this.taskResource
      .moveTask({taskId: taskId, toTaskId: toTaskId})
      .$observable;
  }
}

