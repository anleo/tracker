import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";

import {TaskSearchService} from "../../services/task-search.service";
import {Task} from "../../models/task";
import {TaskService} from "../../services/task.service";
import {BrowserTitleService} from "../../../services/browser-title/browser-title.service";
import {CurrentTaskService} from "../../services/current-task.service";
import {TaskWithStatus} from "../../models/task-with-status";
import {BehaviorSubject, Subject} from "rxjs";
import {SocketService} from "../../../services/socket.service";
import {BusyLoaderService} from "../../../services/busy-loader.service";
import {DnDService} from "../../dnd/dnd.service";

@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html'
})
export class TaskSearchComponent implements OnInit, OnDestroy {
  tasks: Task[];
  task: Task;
  taskId: string;
  query: string;
  editMode: boolean = false;

  $onDestroy: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(private route: ActivatedRoute,
              private taskSearchService: TaskSearchService,
              private currentTaskService: CurrentTaskService,
              private taskService: TaskService,
              private socketService: SocketService,
              private busyLoaderService: BusyLoaderService,
              private router: Router,
              private browserTitleService: BrowserTitleService,
              private dndService: DnDService) {
  }

  ngOnInit(): void {
    let self = this;
    this.socketService.scopeOn(self, 'task.save', (data) => self.search());
    this.socketService.scopeOn(self, 'task.remove', (data) => self.search());

    this.taskService.editTaskModal$
      .takeUntil(this.componentDestroyed$)
      .subscribe((flag) => this.editMode = flag);

    this.taskService.editTaskUpdated$
      .takeUntil(this.componentDestroyed$)
      .subscribe((taskWithStatus: TaskWithStatus) => this.actionProvider(taskWithStatus));

    this.browserTitleService.setTitle('Search');

    this.currentTaskService.task$
      .takeUntil(this.componentDestroyed$)
      .subscribe((task) => this.task = task);

    this.route.params
      .subscribe((params: Params) => {
        this.query = params['query'];
        this.search();
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

  goBack(): void {
    this.router.navigate(['/app/tasks', this.task._id]);
  }

  private search(): void {
    let self = this;

    let loader = function () {
      return self.taskSearchService
        .search(self.query, self.task)
        .map((tasks: Task[]) => {
          self.tasks = tasks;
          return tasks;
        });
    };

    this.task && this.busyLoaderService.load(loader, 'taskSearch');
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

  private onDrop(dropData) {
    dropData.item.parentTaskId = dropData.params.parentTaskId ? dropData.params.parentTaskId :
      dropData.item.parentTaskId;

    if (dropData.params.status) {
      let status = dropData.params.status.id === 'new' ? '' : dropData.params.status.value;
      dropData.item.status = status;
    }

    this.taskService.updateTask(dropData.item).toPromise().then((task) => this.search())
  }

}
