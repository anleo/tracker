import {Component, OnInit, OnDestroy} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";
import {Location} from "@angular/common";
import {TaskService} from "../../services/task.service";
import {Task} from '../../models/task';
import {BrowserTitleService} from "../../../services/browser-title/browser-title.service";
import {TaskWithStatus} from "../../models/task-with-status";
import {CurrentTaskService} from "../../services/current-task.service";
import {SocketService} from "../../../services/socket.service";
import {BusyLoaderService} from "../../../services/busy-loader.service";
import {Router} from "@angular/router";

@Component({
  moduleId: module.id,
  templateUrl: 'task-archive.component.html'
})

export class TaskArchiveComponent implements OnInit, OnDestroy {
  task: Task;
  tasks: Task[] = [];
  editMode: boolean = false;
  $onDestroy: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(private location: Location,
              private router: Router,
              private browserTitleService: BrowserTitleService,
              private busyLoaderService: BusyLoaderService,
              private taskService: TaskService,
              private currentTaskService: CurrentTaskService,
              private socketService: SocketService) {
  }

  ngOnInit(): void {
    let self = this;
    this.socketService.scopeOn(self, 'task.save', (data) => self.getTasks());
    this.socketService.scopeOn(self, 'task.remove', (data) => self.socketOnRemove(data));

    this.currentTaskService.task$
      .takeUntil(this.componentDestroyed$)
      .subscribe((task) => this.task = task);

    this.taskService.editTaskUpdated$
      .takeUntil(this.componentDestroyed$)
      .subscribe((taskWithStatus: TaskWithStatus) => this.actionProvider(taskWithStatus));

    this.taskService.editTaskModal$
      .takeUntil(this.componentDestroyed$)
      .subscribe((flag) => this.editMode = flag);

    this.getTasks();
  }

  ngOnDestroy(): void {
    this.$onDestroy.next(true);
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  private actionProvider(taskWithStatus: TaskWithStatus): void|boolean {
    if (!taskWithStatus) {
      return false;
    }

    if (taskWithStatus.status === 'update') {
      this.onUpdate();
    } else if (taskWithStatus.status === 'move') {
      this.onMove();
    } else if (taskWithStatus.status === 'remove') {
      this.onRemove();
    }
  }

  back(): void {
    this.location.back();
  }

  private onUpdate(): void {
    this.getTasks();
  }

  private onMove(): void {
    this.getTasks();
  }

  private onRemove(): void {
    this.getTasks();
  }

  private socketOnRemove(data): void {
    if (this.task && this.task._id === data.task) {
      if (data.parent) {
        this.router.navigateByUrl('/app/tasks/' + data.parent);
      } else {
        this.router.navigateByUrl('/app/tasks/');
      }
    } else {
      this.getTasks();
    }
  }

  private getTasks(): void {
    let self = this;

    let loader = function () {
      if (self.task) {
        return self.taskService.getArchivedTasks(self.task._id).map((tasks) => {
          self.initTasks(tasks);
          self.browserTitleService.setTitleWithPrefix('Archive', self.task.title);
          return tasks;
        });
      } else {
        return self.taskService.getArchivedProjects().map((tasks) => {
          self.initTasks(tasks);
          return tasks;
        })
      }
    };

    this.busyLoaderService.load(loader, 'getArchivedTasks')
  }

  private initTasks(tasks: Task[]): void {
    this.tasks = tasks;
  }
}
