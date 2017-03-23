import {Component, OnInit, OnDestroy} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";

import {UserService} from "../../../user/services/user.service";
import {TaskService} from "../../services/task.service";
import {Task} from "../../models/task";
import {User} from "../../../user/models/user";
import {TaskWithStatus} from "../../models/task-with-status";
import {BusyLoaderService} from "../../../services/busy-loader.service";
import {SocketService} from "../../../services/socket.service";
import {Location} from "@angular/common";
import {TaskStatusService} from "../../services/task-status.service";
import {TaskStatus} from "../../models/task-status";

@Component({
  templateUrl: 'my-tasks.component.html'
})

export class MyTasksComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  user: User | null = null;
  editMode: boolean = false;
  statusTypes: TaskStatus[];
  $onDestroy: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(private location: Location,
              private userService: UserService,
              private taskService: TaskService,
              private taskStatusService: TaskStatusService,
              private socketService: SocketService,
              private busyLoaderService: BusyLoaderService) {
  }

  ngOnInit(): void {
    let self = this;
    this.socketService.scopeOn(self, 'task.save', (data) => self.getTasks());
    this.socketService.scopeOn(self, 'task.remove', (data) => self.getTasks());

    this.taskService.editTaskUpdated$
      .takeUntil(this.componentDestroyed$)
      .subscribe((taskWithStatus: TaskWithStatus) => this.actionProvider(taskWithStatus));

    this.taskService.editTaskModal$
      .takeUntil(this.componentDestroyed$)
      .subscribe((flag) => this.editMode = flag);

    this.userService.get()
      .takeUntil(this.componentDestroyed$)
      .subscribe(user => {
        this.user = user;
        user && this.getTasks();
      });

    this.taskStatusService
      .getTaskStatusList()
      .subscribe(taskStatusList => {
        this.statusTypes = taskStatusList.filter((status) => status.id !== "accepted");
      });
  }

  ngOnDestroy(): void {
    this.$onDestroy.next(true);
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  back(): void {
    this.location.back();
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
    } else if (taskWithStatus.status === 'close') {
      this.editMode = false;
    }
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

  private getTasks(): void {
    let self = this;

    let loader = function () {
      return self.taskService.getUserTasks(self.user._id)
        .map(tasks => {
          self.tasks = tasks;
          return tasks;
        });
    };

    self.user && self.user._id && this.busyLoaderService.load(loader, 'taskItemInit')
  }
}
