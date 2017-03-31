import {Router} from "@angular/router";
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/mergeMap";

import {Task} from '../../models/task';
import {TaskService} from "../../services/task.service";
import {BrowserTitleService} from "../../../services/browser-title/browser-title.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {TaskWithStatus} from "../../models/task-with-status";
import {CurrentTaskService} from "../../services/current-task.service";
import {SocketService} from "../../../services/socket.service";
import {Subject} from "rxjs";
import {BusyLoaderService} from "../../../services/busy-loader.service";
import {DnDService} from "../../dnd/dnd.service";

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
              private socketService: SocketService,
              private currentTaskService: CurrentTaskService,
              private busyLoaderService: BusyLoaderService,
              private router: Router,
              private dndService: DnDService) {
    this.taskService.editTaskUpdated$
      .takeUntil(this.componentDestroyed$)
      .subscribe((taskWithStatus: TaskWithStatus) => this.actionProvider(taskWithStatus));
  }

  ngOnInit() {
    let self = this;
    this.socketService.scopeOn(self, 'task.save', (data) => self.init());
    this.socketService.scopeOn(self, 'task.remove', (data) => self.socketOnRemove(data));

    this.taskService.editTaskToggle$
      .takeUntil(this.componentDestroyed$)
      .subscribe((editMode) => this.editMode = editMode);

    this.currentTaskService.rootTask$
      .takeUntil(this.componentDestroyed$)
      .subscribe((root) => this.root = root || null);

    this.currentTaskService.parentTask$
      .takeUntil(this.componentDestroyed$)
      .subscribe((parentTask) => this.parentTask = parentTask || null);

    this.currentTaskService.task$
      .takeUntil(this.componentDestroyed$)
      .subscribe((task) => {
        this.task = task || null;
        this.initTask(this.task).subscribe();
        this.editMode = false;

        if (this.root && this.task) {
          if (this.root._id !== this.task._id) {
            this.browserTitleService.setTitleWithPrefix(this.task.title, this.root.title);
          } else {
            this.browserTitleService.setTitle(this.task.title);
          }
        }
      });

    this.dndService.onDrop$
      .takeUntil(this.componentDestroyed$)
      .subscribe((dropData) => {
        this.onDrop(dropData);
      });
  }

  ngOnDestroy(): void {
    this.$onDestroy.next(true);
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  init() {
    let self = this;

    let loader = function () {
      let taskId = self.task && self.task._id ? self.task._id : null;

      self.editMode = false;

      if (taskId) {
        return self.taskService.getTask(taskId).mergeMap((task) => self.initTask(task));
      } else {
        return self.initTask(null);
      }
    };

    this.busyLoaderService.load(loader, 'taskItemInit')
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

  private onDrop(dropData) {
    dropData.item.parentTaskId = dropData.params.parentTaskId ? dropData.params.parentTaskId :
      dropData.item.parentTaskId;

    if (dropData.params.status) {
      let status = dropData.params.status.id === 'new' ? '' : dropData.params.status.value;
      dropData.item.status = status;
    }

    this.taskService.updateTask(dropData.item).toPromise().then((task) => this.init())
  }

  private socketOnRemove(data): void {
    if (this.task && this.task._id === data.task) {
      if (data.parent) {
        this.router.navigateByUrl('/app/tasks/' + data.parent);
      } else {
        this.router.navigateByUrl('/app/tasks/');
      }
    } else {
      this.init();
    }
  }

  initTask(task) {
    this.task = task;
    let taskId = task && task._id ? task._id : null;

    return this.loadTasks(taskId).map(tasks => {
      this.tasks = tasks;
    });
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
