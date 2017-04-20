import {Component, OnInit, ViewContainerRef} from "@angular/core";
import {TaskService} from "../../services/task.service";
import {CurrentTaskService} from "../../services/current-task.service";

import {Task} from '../../models/task';
import {TaskWithStatus} from "../../models/task-with-status";
import {SocketService} from "../../../services/socket.service";
import {DnDService} from "../../dnd/dnd.service";

import {isNull} from "util";
import {TaskBoardItem} from "../../models/task-board-item";
import {ToastsManager} from "ng2-toastr";

@Component({
  selector: 'task-backlog',
  templateUrl: 'task-backlog.component.html',
  providers: [DnDService]
})

export class TaskBacklogComponent implements OnInit {
  root: Task|null = null;
  tasks: Task[] = [];
  task: Task|null = null;
  boardItems: TaskBoardItem[] = [];

  showBacklog: boolean = false;
  addTaskToggle: boolean = false;
  editMode: boolean = false;

  metricsDetails: number;

  constructor(private taskService: TaskService,
              private socketService: SocketService,
              private dndService: DnDService,
              private currentTaskService: CurrentTaskService,
              private toastr: ToastsManager,
              vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(): void {
    // let self = this;
    // this.socketService.scopeOn(self, 'task.save', (data) => this.loadTasks());
    // this.socketService.scopeOn(self, 'task.remove', (data) => this.loadTasks());
    this.taskService.taskMetricsViewType$
      .map(type => !isNull(type) ? type : 0)
      .subscribe(type => {
        this.metricsDetails = type;
      });


    this.currentTaskService.rootTask$.subscribe((root) => {
      this.root = root;
      this.initTask();
    });

    this.taskService.editTaskUpdated$
      .subscribe((taskWithStatus: TaskWithStatus) => this.actionProvider(taskWithStatus));
    // .takeUntil(this.componentDestroyed$)

    this.taskService.editTaskModal$
      .subscribe((flag) => this.editMode = flag);
    // .takeUntil(this.componentDestroyed$)

    this.dndService.onDrop$
      .subscribe((dropData) => {
        this.onDrop(dropData);
      });
    // .takeUntil(this.componentDestroyed$)
  }

  loadTasks() {
    this.root && this.root._id && this.taskService.getChildrenTasks(this.root._id)
      .toPromise()
      .then((tasks) => {
        this.boardItems = tasks.map((task) => {
          return this.wrapToBoardItem(task);
        })
      });
  }

  initTask() {
    this.task = new Task();
    this.task.parentTaskId = this.root && this.root._id;

    this.loadTasks();
  }

  edit(task: Task) {
    this.taskService.setEditTaskModal(task);
  }

  toggleBacklog() {
    this.showBacklog = !this.showBacklog;
  }

  save(): void {
    if (this.addTaskToggle && this.task && this.task.parentTaskId) {
      this.taskService.saveChildTask(this.task).subscribe((task) => setTimeout(() => this.initTask(), 0));
    } else {
      this.taskService.save(this.task).subscribe((task) => setTimeout(() => this.initTask(), 0));
    }
  }

  checkInput(event) {
    this.addTaskToggle = !!(event && event.target && event.target.value);
  }

  wrapToBoardItem(task: Task) {
    return {
      board: null,
      type: 'task',
      item: task
    };
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

  onUpdate() {
    this.loadTasks();
  }

  onMove() {
    this.loadTasks();
  }

  onRemove() {
    this.loadTasks();
  }

  private onDrop(dropData) {
    let boardItem = dropData.item;

    if (!boardItem) {
      return false;
    }

    if (!dropData.params && !dropData.params.parent) {
      return false;
    }

    boardItem.item.parentTaskId = dropData.params.parent;

    this.taskService
      .updateTask(boardItem.item)
      .toPromise()
      .then((task) => this.loadTasks())
      .catch((err) => {
        this.toastr.error(err._body.toString(), 'Something was wrong');
      });
  }
}
