import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";

import {TaskService} from "../../services/task.service";
import {Task} from "../../models/task";
import {BrowserTitleService} from "../../../services/browser-title/browser-title.service";
import {CurrentTaskService} from "../../services/current-task.service";
import {Subject, BehaviorSubject, Observable} from "rxjs";
import {TaskWithStatus} from "../../models/task-with-status";
import {SocketService} from "../../../services/socket.service";
import {BusyLoaderService} from "../../../services/busy-loader.service";
import {DnDService} from "../../dnd/dnd.service";

@Component({
  templateUrl: 'task-tags-search.component.html',
  providers: [TaskService]
})

export class TaskTagsSearchComponent implements OnInit, OnDestroy {
  availableTags: Array<string> = [];
  selectedTags: Array<string> = [];
  tasks: Task[] = [];
  task: Task;
  editMode: boolean = false;

  $onDestroy: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(private contextTaskService: TaskService,
              private currentTaskService: CurrentTaskService,
              private taskService: TaskService,
              private socketService: SocketService,
              private busyLoaderService: BusyLoaderService,
              private route: ActivatedRoute,
              private router: Router,
              private browserTitleService: BrowserTitleService,
              private dndService: DnDService) {
  }

  ngOnInit(): void {
    let self = this;
    this.socketService.scopeOn(self, 'task.save', (data) => self.reinit());
    this.socketService.scopeOn(self, 'task.remove', (data) => self.reinit());

    this.currentTaskService.task$
      .takeUntil(this.componentDestroyed$)
      .subscribe((task) => this.task = task);

    this.taskService.editTaskUpdated$
      .takeUntil(this.componentDestroyed$)
      .subscribe((taskWithStatus: TaskWithStatus) => this.actionProvider(taskWithStatus));

    this.taskService.editTaskModal$
      .takeUntil(this.componentDestroyed$)
      .subscribe((flag) => this.editMode = flag);

    this.dndService.onDrop$
      .takeUntil(this.componentDestroyed$)
      .subscribe((dropData) => {
        this.onDrop(dropData);
      });

    this.router.events
      .takeUntil(this.componentDestroyed$)
      .subscribe((event) => {
        let tagsPath = /tags/.test(this.route.toString());

        if (event instanceof NavigationEnd && tagsPath) {
          this.selectedTags = this.route.snapshot.queryParams['tags'] ?
            this.route.snapshot.queryParams['tags'].split(',') : [];

          this.getTasks().subscribe();
        }
      });

    this.getTags().subscribe();

    this.browserTitleService.setTitle('Search by tags');
  }

  ngOnDestroy(): void {
    this.$onDestroy.next(true);
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  toggleTag(tag: string): void {
    if (!this.inListTags(this.selectedTags, tag)) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(this.selectedTags.indexOf(tag), 1);
    }

    this.getTasks().subscribe();
    this.navigateWithTags();
  }

  private reinit() {
    let self = this;

    let loader = function () {
      return self.getTags().mergeMap(() => self.getTasks());
    };

    this.busyLoaderService.load(loader, 'taskSearchByTags');
  }

  private getTags(): Observable<any> {
    return this.contextTaskService
      .getTags(this.task)
      .map(tags => {
        this.availableTags = tags;
        return tags;
      });
  }

  private getTasks(): Observable<Task[]> {
    if (this.selectedTags.length) {
      return this.contextTaskService.getTasksByTags(this.task._id, this.selectedTags)
        .map(tasks => {
          this.tasks = tasks;
          return tasks;
        });
    } else {
      return Observable.create(() => this.tasks = []);
    }
  }

  private navigateWithTags(): void {
    if (this.selectedTags.length) {
      this.router.navigate(['/app/tasks', this.task._id, 'tags'], {queryParams: {tags: this.selectedTags}});
    } else {
      this.router.navigate(['/app/tasks', this.task._id, 'tags']);
    }
  }

  isActiveTag(tag: string): boolean {
    return this.inListTags(this.selectedTags, tag);
  }

  private inListTags(tags: Array<string>, tag: string): boolean {
    return tags.find(found => found === tag) ? true : false;
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
    this.reinit();
  }

  private onMove(): void {
    this.reinit();
  }

  private onRemove(): void {
    this.reinit();
  }

  private onClose(): void {
    this.reinit();
  }

  private onDrop(dropData) {
    dropData.item.parentTaskId = dropData.params.parentTaskId ? dropData.params.parentTaskId :
      dropData.item.parentTaskId;

    if (dropData.params.status) {
      let status = dropData.params.status.id === 'new' ? '' : dropData.params.status.value;
      dropData.item.status = status;
    }

    this.taskService.updateTask(dropData.item).toPromise().then((task) => this.reinit())
  }
}
