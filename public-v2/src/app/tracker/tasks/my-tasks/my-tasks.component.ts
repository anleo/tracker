import {Component, OnInit, OnDestroy} from "@angular/core";
import {Location} from "@angular/common";
import {BehaviorSubject} from "rxjs";

import {UserService} from "../../../user/services/user.service";
import {TaskService} from "../../services/task.service";
import {Task} from "../../models/task";
import {User} from "../../../user/models/user";
import {TaskWithStatus} from "../../models/task-with-status";

@Component({
  templateUrl: 'my-tasks.component.html'
})

export class MyTasksComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  user: User | null = null;
  editMode: boolean = false;
  $onDestroy: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private userService: UserService,
              private taskService: TaskService,
              private location: Location) {
  }

  ngOnInit(): void {
    this.taskService.editTaskUpdated$
      .subscribe((taskWithStatus: TaskWithStatus) => this.actionProvider(taskWithStatus));

    this.taskService.editTaskModal$
      .subscribe((flag) => this.editMode = flag);

    this.userService.get()
      .subscribe(user => this.user = user);

    this.getTasks();
  }

  ngOnDestroy(): void {
    this.$onDestroy.next(true);
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
    this.taskService.getUserTasks(this.user._id)
      .subscribe(tasks => {
        this.tasks = tasks;
        this.taskService.setTasks(tasks);
      });
  }
}
