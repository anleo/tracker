import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

import {TaskService} from "../../services/task.service";
import {Task} from '../../models/task';
import {BrowserTitleService} from "../../../services/browser-title/browser-title.service";
import {TaskWithStatus} from "../../models/task-with-status";
import {BehaviorSubject} from "rxjs";

@Component({
  moduleId: module.id,
  templateUrl: 'task-archive.component.html'
})

export class TaskArchiveComponent implements OnInit, OnDestroy {
  task: Task;
  tasks: Task[] = [];
  editMode: boolean = false;
  $onDestroy: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  channel: string = 'task-archived-component';

  constructor(private route: ActivatedRoute,
              private location: Location,
              private browserTitleService: BrowserTitleService,
              private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.taskService.editTaskUpdated$
      .subscribe((taskWithStatus: TaskWithStatus) => this.actionProvider(taskWithStatus));

    this.taskService.editTaskModal$
      .subscribe((flag) => this.editMode = flag);

    this.task = this.route.parent.snapshot.data['task'];
    this.getTasks();
  }

  ngOnDestroy(): void {
    this.$onDestroy.next(true);
  }

  private actionProvider(taskWithStatus: TaskWithStatus): void|boolean {
    if (!taskWithStatus || taskWithStatus && taskWithStatus.channel !== this.channel) {
      return false;
    }

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
