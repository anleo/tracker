import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from "rxjs";

import {Task} from '../models/task';
import {TaskWithStatus} from '../models/task-with-status';
import {TaskResource} from "../resources/tasks.resource";
import {User} from "../../user/models/user";
import {FileResourse} from "../resources/file.resource";
import {Router} from "@angular/router";
import {HistoryMessage} from "../models/history-message";

@Injectable()
export class TaskService {
  task: Task|null = null;
  tasks: Task[]|null = null;
  editTask: Task|null = null;

  task$: BehaviorSubject<Task> = new BehaviorSubject<Task>(null);
  tasks$: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>(null);

  editTask$: BehaviorSubject<Task> = new BehaviorSubject<Task>(null);
  editTaskModal$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  editTaskUpdated$: BehaviorSubject<TaskWithStatus> = new BehaviorSubject<TaskWithStatus>(null);

  constructor(private taskResource: TaskResource,
              private fileResource: FileResourse,
              private router: Router) {
    this.task$.subscribe((task: Task) => this.task = task);

    this.tasks$.subscribe((tasks: Task[]) => this.tasks = tasks);

    this.editTask$.subscribe((task: Task) => this.editTask = task);
    this.editTaskUpdated$.subscribe((taskWithStatus: TaskWithStatus) => this.actionProvider(taskWithStatus));
  }

  actionProvider(taskWithStatus: TaskWithStatus):void|boolean {
    if (!taskWithStatus) {
      return false;
    }

    let task = taskWithStatus.task;

    if (taskWithStatus.status === 'update') {
      this.onUpdate(task);
    } else if (taskWithStatus.status === 'remove') {
      this.onRemove(task);
    } else if (taskWithStatus.status === 'move') {
      this.onMove(task);
    }
  }

  onUpdate(task: Task):void {
    let tasks = this.tasks || [];
    this.tasks = [];
    let taskFound = tasks.find((_task) => _task._id === task._id);

    if (this.task && this.task._id === task._id) {
      this.task = task;
      this.task$.next(this.task);
    } else {
      if (taskFound) {
        tasks = tasks.map((_task) => {
          if (_task._id === task._id) {
            _task = task;
          }
          return _task;
        });
      } else {
        tasks.push(task);
      }

      this.tasks = tasks;
      this.tasks$.next(this.tasks);
    }
  }

  onRemove(task: Task):void {
    let tasks = this.tasks;
    this.tasks = [];

    if (this.task && this.task._id === task._id) {
      this.task$.next(null);
      if (this.task.parentTaskId) {
        this.router.navigateByUrl('/app/tasks/' + this.task.parentTaskId);
      } else {
        this.router.navigateByUrl('/app/tasks/');
      }
    } else {
      let index = tasks.indexOf(task);
      if (index > -1) {
        tasks.splice(index, 1);
      }

      this.tasks = tasks;
      this.tasks$.next(this.tasks);
    }
  }

  onMove(task: Task):void|null {
    if(!task) {
      return null;
    }

    if (task._id === (this.task && this.task._id)) {
      this.task$.next(task);
    } else {
      let taskFound = this.tasks && this.tasks.find((_task) => _task._id === task._id);
      if (taskFound) {
        let tasks = this.tasks.filter(item => item._id !== task._id);
        this.tasks$.next(tasks);
      }
    }
  }

  setTasks(tasks: Task[]):void {
    this.tasks$.next(tasks);
  }

  setEditTask(task: Task):void {
    this.editTask$.next(task);
  }

  setEditTaskModal(task: Task):void {
    this.editTaskModal$.next(true);
    this.editTask$.next(task);
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

  getTaskHistory(task: Task): Observable <HistoryMessage[]> {
    return this.taskResource
      .getTaskHistory({taskId: task._id})
      .$observable;
  }

  createComment(task: Task, comment:HistoryMessage): Observable <HistoryMessage> {
    return this.taskResource
      .createCommnent(comment, {taskId: task._id})
      .$observable;
  }

  getUserTasks(userId: string): Observable <Task[]> {
    return this.taskResource
      .getUserTasks({userId: userId})
      .$observable
  }
}

