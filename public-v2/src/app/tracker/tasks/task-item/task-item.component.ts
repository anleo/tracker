import {ActivatedRoute, Router} from "@angular/router";
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable} from "rxjs/Observable";

import {Task} from '../../models/task';
import {TaskService} from "../../services/task.service";
import {BrowserTitleService} from "../../../services/browser-title/browser-title.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {TaskWithStatus} from "../../models/task-with-status";
import {CurrentTaskService} from "../../services/current-task.service";
import {Subject} from "rxjs";

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

  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(private taskService: TaskService,
              private browserTitleService: BrowserTitleService,
              private currentTaskService: CurrentTaskService,
              private router: Router) {
    this.taskService.editTaskUpdated$
      .takeUntil(this.componentDestroyed$)
      .subscribe((taskWithStatus: TaskWithStatus) => this.actionProvider(taskWithStatus));
  }

  ngOnInit() {
    this.taskService.editTaskToggle$
      .takeUntil(this.componentDestroyed$)
      .subscribe((editMode) => this.editMode = editMode);

    this.currentTaskService.task$
      .takeUntil(this.componentDestroyed$)
      .subscribe((task) => {
        this.task = task || null;
        this.initTask(this.task);
        this.editMode = false;
      });
  }

  init() {
    let taskId = this.task && this.task._id ? this.task._id : null;

    if (taskId) {
      this.taskService.getTask(taskId).subscribe((task) => this.initTask(task));
    } else {
      this.initTask(null);
    }

    this.editMode = false;
  }

  ngOnDestroy(): void {
    this.$onDestroy.next(true);
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
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
    } else if (taskWithStatus.status === 'close') {
      this.editMode = false;
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
