import {Component, OnInit, OnDestroy} from "@angular/core";
import {Location} from "@angular/common";
import {BehaviorSubject} from "rxjs";

import {TaskService} from "../../services/task.service";
import {Task} from '../../models/task';
import {BrowserTitleService} from "../../../services/browser-title/browser-title.service";
import {TaskWithStatus} from "../../models/task-with-status";
import {CurrentTaskService} from "../../services/current-task.service";

@Component({
  moduleId: module.id,
  templateUrl: 'task-archive.component.html'
})

export class TaskArchiveComponent implements OnInit, OnDestroy {
  task: Task;
  tasks: Task[] = [];
  editMode: boolean = false;
  $onDestroy: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private location: Location,
              private browserTitleService: BrowserTitleService,
              private taskService: TaskService,
              private currentTaskService: CurrentTaskService) {
  }

  ngOnInit(): void {
    this.currentTaskService.task$.subscribe((task) => this.task = task);

    this.taskService.editTaskUpdated$
      .subscribe((taskWithStatus: TaskWithStatus) => this.actionProvider(taskWithStatus));

    this.taskService.editTaskModal$
      .subscribe((flag) => this.editMode = flag);

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
    if (this.task) {
      this.taskService.getArchivedTasks(this.task._id).subscribe((tasks) => {
        this.initTasks(tasks);
        this.browserTitleService.setTitleWithPrefix('Archive', this.task.title);
      });
    } else {
      this.taskService.getArchivedProjects().subscribe((tasks) => this.initTasks(tasks))
    }
  }

  private initTasks(tasks: Task[]): void {
    this.tasks = tasks;
  }
}
