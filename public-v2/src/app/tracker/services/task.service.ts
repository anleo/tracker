import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from "rxjs";

import {Task} from '../models/task';
import {TaskWithStatus} from '../models/task-with-status';
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

  editTask$: BehaviorSubject<Task> = new BehaviorSubject<Task>(null);
  editTaskModal$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  editTaskUpdated$: BehaviorSubject<TaskWithStatus> = new BehaviorSubject<TaskWithStatus>(null);

  taskMetricsViewType$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  constructor(private taskResource: TaskResource,
              private router: Router) {
    this.task$.subscribe((task: Task) => this.task = task);

    this.tasks$.subscribe((tasks: Task[]) => this.tasks = tasks);

    this.editTask$.subscribe((task: Task) => this.editTask = task);
    this.editTaskUpdated$.subscribe((taskWithStatus: TaskWithStatus) => this.actionProvider(taskWithStatus));

    this.taskMetricsViewType$.subscribe(type => this.taskMetricsViewType = type);
  }

  actionProvider(taskWithStatus: TaskWithStatus): void|boolean {
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

  loadTasks(taskId: string): Observable<Task[]> {
    if (taskId) {
      return this.getChildrenTasks(taskId);
    } else {
      return this.getTasks();
    }
  }

  onUpdate(task: Task): void {
    if (!task) {
      return null;
    }

    let taskId = task && task._id ? task._id : null;

    let tasks = this.tasks || [];
    this.tasks = [];
    let taskFound = tasks.find((_task) => _task._id === taskId);

    if (this.task && this.task._id === taskId) {
      this.task = task;
      this.task$.next(task);
      this.loadTasks(taskId).subscribe((tasks) => this.tasks$.next(tasks));
    } else {
      if (taskFound) {
        tasks = tasks.map((_task) => {
          if (_task._id === taskId) {
            _task = task;
          }
          return _task;
        });
      } else {
        tasks.push(task);
      }
      this.reloadTasks(task, tasks);
    }
  }

  onRemove(task: Task): void {
    if (!task) {
      return null;
    }

    let tasks = this.tasks;
    this.tasks = [];
    let taskId = task && task._id ? task._id : null;

    if (this.task && this.task._id === taskId) {
      this.task$.next(null);
      this.loadTasks(taskId).subscribe((tasks) => this.tasks$.next(tasks));
      if (this.task && this.task.parentTaskId) {
        this.router.navigateByUrl('/app/tasks/' + this.task.parentTaskId);
      } else {
        this.router.navigateByUrl('/app/tasks/');
      }
    } else {
      let index = tasks.indexOf(task);
      if (index > -1) {
        tasks.splice(index, 1);
      }

      this.reloadTasks(task, tasks);
    }
  }

  onMove(task: Task): void|null {
    if (!task) {
      return null;
    }

    let taskId = task && task._id ? task._id : null;

    if (taskId === (this.task && this.task._id)) {
      this.task$.next(task);
      this.loadTasks(taskId).subscribe((tasks) => this.tasks$.next(tasks));
    } else {
      let taskFound = this.tasks && this.tasks.find((_task) => _task._id === taskId);
      if (taskFound) {
        this.tasks = this.tasks.filter(item => item._id !== taskId);
        if (this.task && this.task._id) {
          this.getTask(this.task._id).subscribe((task) => this.task$.next(task));
          this.loadTasks(this.task._id).subscribe((tasks) => this.tasks$.next(tasks));
        } else {
          this.getTasks().subscribe((tasks) => this.tasks$.next(tasks));
        }
      }
    }
  }

  private reloadTasks(task: Task, tasks: Task[]): void {
    this.tasks = tasks;
    if (task && task.parentTaskId) {
      this.getTask(task.parentTaskId).subscribe((parentTask) => {
        this.task$.next(parentTask);
      });
      this.loadTasks(task.parentTaskId).subscribe((tasks) => this.tasks$.next(tasks));
    } else {
      this.getTasks().subscribe((tasks) => this.tasks$.next(tasks));
    }
  }

  setTasks(tasks: Task[]): void {
    this.tasks$.next(tasks);
  }

  setEditTask(task: Task): void {
    this.editTask$.next(task);
  }

  setTask(task: Task): void {
    this.task$.next(task);
  }

  setTaskMetricsViewType(type: number): void {
    this.taskMetricsViewType$.next(type);
  }

  setEditTaskModal(task: Task): void {
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

