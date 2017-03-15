import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

import {TaskSearchService} from "../../services/task-search.service";
import {Task} from "../../models/task";
import {TaskService} from "../../services/task.service";
import {BrowserTitleService} from "../../../services/browser-title/browser-title.service";
import {CurrentTaskService} from "../../services/current-task.service";
import {TaskWithStatus} from "../../models/task-with-status";

@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html'
})
export class TaskSearchComponent implements OnInit {
  tasks: Task[];
  task: Task;
  taskId: string;
  query: string;
  editMode: boolean = false;

  constructor(private route: ActivatedRoute,
              private taskSearchService: TaskSearchService,
              private currentTaskService: CurrentTaskService,
              private taskService: TaskService,
              public toastr: ToastsManager,
              private router: Router,
              private browserTitleService: BrowserTitleService,
              vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  goBack(): void {
    this.router.navigate(['/app/tasks', this.task._id]);
  }

  ngOnInit(): void {
    this.taskService.editTaskModal$.subscribe((flag) => this.editMode = flag);
    this.taskService.editTaskUpdated$
      .subscribe((taskWithStatus: TaskWithStatus) => this.actionProvider(taskWithStatus));

    this.browserTitleService.setTitle('Search');

    this.currentTaskService.task$.subscribe((task) => this.task = task);

    this.route.params
      .subscribe((params: Params) => {
        this.query = params['query'];
        this.search();
      });
  }

  private search(): void {
    this.task && this.taskSearchService
      .search(this.query, this.task)
      .then((tasks: Task[]) => {
        this.tasks = tasks;
      })
      .catch((err: any) => {
        this.toastr.error(err._body);
      });
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
      this.onClose();
    }
  }

  private onUpdate(): void {
    this.search();
  }

  private onMove(): void {
    this.search();
  }

  private onRemove(): void {
    this.search();
  }

  private onClose(): void {
    this.search();
  }

}
