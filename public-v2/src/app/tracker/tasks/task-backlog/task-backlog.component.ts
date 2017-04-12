import {Component, OnInit} from "@angular/core";
import {TaskService} from "../../services/task.service";
import {CurrentTaskService} from "../../services/current-task.service";

import {Task} from '../../models/task';
import {TaskWithStatus} from "../../models/task-with-status";
import {SocketService} from "../../../services/socket.service";
import {DnDService} from "../../dnd/dnd.service";

import {isNull} from "util";
import {TaskBoardItem} from "../../models/task-board-item";

@Component({
  selector: 'task-backlog',
  templateUrl: 'task-backlog.component.html'
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
              private currentTaskService: CurrentTaskService) {
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

    // this.dndService.onDrop$
    //   .subscribe((dropData) => {
    //     this.onDrop(dropData);
    //   });
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

  private onDrop(dropData) {
    if (!dropData.item) {
      return false;
    }

    dropData.item.parentTaskId = dropData.params.parentTaskId ? dropData.params.parentTaskId :
      dropData.item.parentTaskId;

    if (dropData.params.status) {
      dropData.item.status = dropData.params.status.id === 'new' ? '' : dropData.params.status.value;
    }

    this.taskService.updateTask(dropData.item).toPromise().then((task) => this.loadTasks());
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
}
