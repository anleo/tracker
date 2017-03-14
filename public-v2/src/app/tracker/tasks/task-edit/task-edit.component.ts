import {Component, OnInit, Input, ViewContainerRef, HostListener} from '@angular/core';

import {Task} from '../../models/task';
import {TaskStatus} from '../../models/task-status';
import {TaskService} from "../../services/task.service";
import {TaskStatusService} from "../../services/task-status.service";
import {TaskPrioritiesMock} from '../../mocks/task-priorities.mock';
import {ToastsManager} from "ng2-toastr";
import {ActivatedRoute, Params} from "@angular/router";
import {Observable} from "rxjs";
import {TaskByChannel} from "../../models/task-by-channel";

@Component({
  selector: 'app-task-edit',
  templateUrl: 'task-edit.component.html',
  host: {
    '(document:keyup)': 'onKeyUp($event)'
  }
})
export class TasksEditComponent implements OnInit {
  @Input() task: Task|null = null;
  parentTask: Task|null = null;
  parentTaskId: string|null = null;
  priorities: number[] = TaskPrioritiesMock;
  taskMoveToggle: boolean = false;
  statuses: TaskStatus[] = [];
  modalMode: boolean = false;
  initEditTask: Task;
  counter: number = 0;
  channel: string|null = null;

  constructor(private taskService: TaskService,
              private taskStatusService: TaskStatusService,
              public vcr: ViewContainerRef,
              private route: ActivatedRoute,
              public toastr: ToastsManager) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.keyCode == 27) {
      this.close();
    }
  }

  ngOnInit(): void {
    this.taskService.editTaskModal$.subscribe((modalMode: boolean) => this.modalMode = modalMode);

    this.route.params
      .switchMap((params: Params) => {
        if (params['taskId']) {
          return Observable.of(params['taskId']);
        } else {
          return Observable.of(null);
        }
      })
      .subscribe(task => {
        this.parentTaskId = task || null;
        this.initTask();

        this.taskService.editTask$.subscribe((taskByChannel: TaskByChannel) => {
          let task = taskByChannel && taskByChannel.task ? taskByChannel.task : null;
          this.channel = taskByChannel && taskByChannel.channel ? taskByChannel.channel : null;

          this.getInitEditedTask(task);

          if (task) {
            this.task = task ? task : new Task();
            let editTaskId = task && task._id ? task._id : null;
            let mainTaskId = this.parentTaskId;
            let parentTask = null;

            if (editTaskId) {
              parentTask = editTaskId === mainTaskId ? null : mainTaskId;
            } else {
              parentTask = mainTaskId;
            }

            if (this.task && !this.task.parentTaskId) {
              this.task.parentTaskId = parentTask;
            }
          }
        });
      });

    this.taskStatusService
      .getTaskStatusList()
      .subscribe(taskStatusList => this.statuses = taskStatusList);
  }

  initTask(): void {
    this.taskMoveToggle = false;
    this.task = new Task();
    this.task.parentTaskId = this.parentTaskId;
    this.taskService.editTask$.next({task: this.task, channel: this.channel});
  }

  reinitTask(task: Task): void {
    this.closeModal();
    this.taskService.editTaskUpdated$.next({task: task, status: 'update', channel: this.channel});
    setTimeout(() => this.initTask(), 0);
  }

  getInitEditedTask(task: Task) {
    if (task !== null && task._id && this.counter == 0) {
      this.counter = 1;
      this.initEditTask = Object.assign({}, task);
    }
  }

  save(): void {
    this.counter = 0;
    if (this.task && this.task.parentTaskId) {
      this.taskService.saveChildTask(this.task).subscribe((task) => this.reinitTask(task));
    } else {
      this.taskService.save(this.task).subscribe((task) => this.reinitTask(task));
    }
  }

  remove(task: Task): void {
    this.counter = 0;
    this.taskService.remove(this.task).subscribe(() => {
      this.closeModal();
      this.taskService.editTaskUpdated$.next({task: task, status: 'remove', channel: this.channel});
      setTimeout(() => this.initTask(), 0);
    });
  }

  onMove(task: Task): void {
    this.counter = 0;
    this.closeModal();
    this.taskService.editTaskUpdated$.next({task: task, status: 'move', channel: this.channel});
    setTimeout(() => this.initTask(), 0);
  }

  close(): void {
    this.counter = 0;
    this.closeModal();
    this.taskService.editTaskUpdated$.next({task: this.initEditTask, status: 'close', channel: this.channel});
    setTimeout(() => this.initTask(), 0);
  }

  setField(key: string, value: string): void {
    this.task[key] = value;
  }

  taskChangeHandler(task: Task): void {
    this.task = task;
  }

  handleOnUpload(file: any): void {
    this.task.files.push(file);
  }

  handleOnDelete(file: any): void {
    this.taskService.deleteFile(file, this.task)
      .subscribe(() => {
        this.task.files.splice(this.task.files.indexOf(file), 1);
        this.toastr.error('Deleted');
      })
  }

  showTaskMove(): void {
    this.taskMoveToggle = !this.taskMoveToggle;
  }

  private closeModal() {
    this.taskService.editTaskModal$.next(false);
  }

}
