import {ActivatedRoute, Params, Router} from "@angular/router";
import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {Observable} from "rxjs/Observable";
import * as _ from 'lodash';

import {Task} from '../../models/task';
import {TaskService} from "../../services/task.service";
import {BrowserTitleService} from "../../../services/browser-title/browser-title.service";
import {ROOT_TASKSERVICE} from "../../../app.tokens";
import {SocketService} from "../../../services/socket.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {TaskWithStatus} from "../../models/task-with-status";

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
              private socketService: SocketService,
              private router: Router) {
    this.taskService.editTaskUpdated$.subscribe((taskWithStatus: TaskWithStatus) => this.actionProvider(taskWithStatus));
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.route.params
      .switchMap((params: Params) => {
        if (params['taskId']) {
          return this.taskService.getTask(params['taskId']);
        } else {
          return Observable.of(null);
        }
      })
      .subscribe(task => this.initTask(task));
  }

  ngOnDestroy(): void {
    this.$onDestroy.next(true);
  }

  actionProvider(taskWithStatus: TaskWithStatus): void|boolean {
    if (!taskWithStatus) {
      return false;
    }

    let task = taskWithStatus.task;

    if (taskWithStatus.status === 'update') {
      this.onUpdate();
    } else if (taskWithStatus.status === 'move') {
      this.onMove();
    } else if (taskWithStatus.status === 'remove') {
      this.onRemove(task);
    }
  }

  onUpdate(): void {
    this.init();
  }

  onMove(): void {
    this.init();
  }

  onRemove(task: Task): void {
    let taskId = task && task._id ? task._id : null;

    if (this.task && this.task._id === taskId) {
      if (this.task && this.task.parentTaskId) {
        this.router.navigateByUrl('/app/tasks/' + this.task.parentTaskId);
      } else {
        this.router.navigateByUrl('/app/tasks/');
      }
    } else {
      this.init();
    }
  }

  initTask(task) {
    this.parentTask = null;
    this.root = null;
    this.tasks = [];

    this.task = task;
    this.task && this.browserTitleService.setTitle(this.task.title);
    let taskId = task && task._id ? task._id : null;

    this.loadTasks(taskId).subscribe(tasks => this.tasks = tasks);

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
