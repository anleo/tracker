import {ActivatedRoute, Params} from "@angular/router";
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable} from "rxjs/Observable";
import * as _ from 'lodash';

import {Task} from '../../models/task';
import {TaskService} from "../../services/task.service";
import {BrowserTitleService} from "../../../services/browser-title/browser-title.service";
import {SocketService} from "../../../services/socket.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
  selector: 'app-task-item',
  templateUrl: 'task-item.component.html'
})
export class TaskItemComponent implements OnInit, OnDestroy {
  task: Task|null = null;
  tasks: Task[] = [];
  root: Task|null = null;
  parentTask: Task|null = null;
  editMode: boolean = false;
  showHistory: boolean = false;
  $onDestroy: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private route: ActivatedRoute,
              private taskService: TaskService,
              private browserTitleService: BrowserTitleService,
              private socketService: SocketService) {
  }

  ngOnInit() {
    let self = this;

    this.socketService.scopeOn(self, 'task.save', (data) => self.socketSync(data));
    this.socketService.scopeOn(self, 'task.remove', (data) => self.socketSync(data));

    this.taskService.task$.subscribe((task) => this.init(task));
    this.taskService.tasks$.subscribe((tasks) => this.tasks = tasks);
    this.taskService.editTask$.subscribe((task) => this.editMode = !!(task && task.title));
    this.route.params
      .switchMap((params: Params) => {
        if (params['taskId']) {
          this.taskService.tasks$.next([]);
          return this.taskService.getTask(params['taskId']);
        } else {
          return Observable.of(null);
        }
      })
      .subscribe(task => this.initTaskData(task));
  }

  ngOnDestroy(): void {
    this.$onDestroy.next(true);
  }

  private initTaskData(task) {
    this.init(task);
    this.taskService.task$.next(task);
  }

  socketSync(data): Task {
    let task = _.find(this.tasks, (aTask) => aTask._id === data.task);

    if (this.task && this.task._id == data.parent) {
      this.taskService.getTask(this.task._id)
        .subscribe(task => this.initTaskData(task));

    } else if (this.task && this.task._id == data.task) {
      this.taskService.getTask(this.task._id)
        .subscribe(task => this.initTaskData(task));
    } else if ((!this.task || !this.task._id) && !data.parent) {
      this.loadTasks(null)
        .subscribe((tasks) => this.tasks = tasks);
    }

    return task;
  };

  init(task) {
    this.parentTask = null;
    this.root = null;
    this.tasks = [];

    this.task = task;
    this.task && this.browserTitleService.setTitle(this.task.title);
    let taskId = task && task._id ? task._id : null;

    this.loadTasks(taskId).subscribe(tasks => this.taskService.tasks$.next(tasks));
    taskId && this.taskService.getRoot(taskId).subscribe((root) => {
      this.root = root;

      if (this.root._id !== this.task._id) {
        this.browserTitleService.setTitleWithPrefix(this.task.title, this.root.title);
      }
    });

    if (task && task.parentTaskId) {
      this.taskService.getTask(task.parentTaskId).subscribe((parentTask) => this.parentTask = parentTask);
    }
  }

  loadTasks(taskId: string|null): Observable<Task[]> {
    if (taskId) {
      return this.taskService.getChildrenTasks(taskId);
    } else {
      return this.taskService.getTasks();
    }
  }

  edit(task: Task) {
    this.taskService.setEditTaskModal(task);
    this.showHistory = false;
  }

  toggleTaskHistory(): void {
    this.showHistory = !this.showHistory;
  }

  resetTaskHistory(): void {
    this.showHistory = false;
  }
}
