import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from "rxjs";

import {Task} from '../models/task';
import {TaskWithStatus} from '../models/task-with-status';
import {TaskByChannel} from '../models/task-by-channel';
import {TaskResource} from "../resources/tasks.resource";
import {User} from "../../user/models/user";
import {Router} from "@angular/router";
import {HistoryMessage} from "../models/history-message";

@Injectable()
export class TaskService {
  task: Task|null = null;
  tasks: Task[]|null = null;
  editTask: Task|null = null;
  root: Task|null = null;
  taskMetricsViewType: number = null;

  task$: BehaviorSubject<Task> = new BehaviorSubject<Task>(null);
  tasks$: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>(null);

  editTask$: BehaviorSubject<TaskByChannel> = new BehaviorSubject<TaskByChannel>(null);
  editTaskModal$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  editTaskUpdated$: BehaviorSubject<TaskWithStatus> = new BehaviorSubject<TaskWithStatus>(null);

  taskMetricsViewType$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  constructor(private taskResource: TaskResource,
              private router: Router) {
    this.task$.subscribe((task: Task) => this.task = task);

    this.tasks$.subscribe((tasks: Task[]) => this.tasks = tasks);

    this.editTask$.subscribe((taskByChannel: TaskByChannel) => {
      this.editTask = taskByChannel && taskByChannel.task ? taskByChannel.task : null;
    });

    this.taskMetricsViewType$.subscribe(type => this.taskMetricsViewType = type);
  }

  setTasks(tasks: Task[]): void {
    this.tasks$.next(tasks);
  }

  setEditTask(task: Task, channel?: string): void {
    let _channel = channel || null;
    this.editTask$.next({task: task, channel: _channel});
  }

  setTask(task: Task): void {
    this.task$.next(task);
  }

  setTaskMetricsViewType(type: number): void {
    this.taskMetricsViewType$.next(type);
  }

  setEditTaskModal(task: Task, channel?: string): void {
    this.editTaskModal$.next(true);
    this.setEditTask(task, channel);
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

  getParentByTaskId(taskId: string): Observable<Task> {
    return this.taskResource.getParent({}, {taskId: taskId}).$observable;
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

  getTaskReportByDate(date: string): Observable <Task[]> {
    return this.taskResource
      .getTaskReportByDate({date: date})
      .$observable;
  }

  getTaskReportByTask(taskId: string, date: string, userId: string): Observable <Task[]> {
    return this.taskResource
      .getTaskReportByTask({taskId: taskId, date: date, userId: userId})
      .$observable;
  }

  getTaskTeam(taskId: string): Observable <User[]> {
    return this.taskResource
      .getTaskTeam({taskId: taskId})
      .$observable;
  }

  deleteFile(file: any, task: Task): Observable <any> {
    return this.taskResource.deleteTaskFile({taskId: task._id, fileId: file._id})
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

  createComment(task: Task, comment: HistoryMessage): Observable <HistoryMessage> {
    return this.taskResource
      .createComment(comment, {taskId: task._id})
      .$observable;
  }

  getUserTasks(userId: string): Observable <Task[]> {
    return this.taskResource
      .getUserTasks({userId: userId})
      .$observable
  }

  getArchivedProjects(): Observable <Task[]> {
    return this.taskResource
      .getArchivedProjects()
      .$observable
  }

  getArchivedTasks(taskId: string): Observable <Task[]> {
    return this.taskResource
      .getArchivedTasks({taskId: taskId})
      .$observable
  }

  getTaskMetrics(task: Task): Observable <Task> {
    return this.taskResource.getTaskMetrics(task, {taskId: task._id})
      .$observable
  }

  getTasksByTags(taskId: string, tags: Array<string>): Observable <Task[]> {
    return this.taskResource
      .getTasksByTags({taskId: taskId, query: tags})
      .$observable;
  }
}

