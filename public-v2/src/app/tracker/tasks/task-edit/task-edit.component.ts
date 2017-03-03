import {Component, OnInit, Output, EventEmitter, Input, ViewContainerRef} from '@angular/core';

import {Task} from '../../models/task';
import {TaskStatus} from '../../models/task-status';
import {TaskService} from "../../services/task.service";
import {TaskStatusService} from "../../services/task-status.service";
import {TaskPrioritiesMock} from '../../mocks/task-priorities.mock';
import {ToastsManager} from "ng2-toastr";

@Component({
  selector: 'app-task-edit',
  templateUrl: 'task-edit.component.html'
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

  constructor(private taskService: TaskService,
              private taskStatusService: TaskStatusService,
              public vcr: ViewContainerRef,
              public toastr: ToastsManager) {
    this.toastr.setRootViewContainerRef(vcr);

  }

  ngOnInit(): void {
    this.taskService.editTaskModal$.subscribe((modalMode: boolean) => this.modalMode = modalMode);
    this.taskService.task$.subscribe((task) => {
      this.parentTaskId = task && task._id ? task._id : null;
      this.initTask();

      this.taskService.editTask$.subscribe((task) => {
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

  getInitEditedTask(task: Task) {
    if (task !== null && task._id && this.counter == 0) {
      this.counter = 1;
      this.initEditTask = Object.assign({}, task);
    }
  }

  initTask(): void {
    this.task = new Task();
    this.task.parentTaskId = this.parentTaskId;
    this.taskService.editTask$.next(this.task);
  }

  save(): void {
    this.counter = 0;
    if (this.task && this.task.parentTaskId) {
      this.taskService.saveChildTask(this.task).subscribe((task) => this.reinitTask(task));
    } else {
      this.taskService.save(this.task).subscribe((task) => this.reinitTask(task));
    }
  }

  reinitTask(task: Task): void {
    this.closeModal();
    this.taskService.editTaskUpdated$.next({task: task, status: 'update'});
    setTimeout(() => this.initTask(), 0);
  }

  remove(task: Task): void {
    this.counter = 0;
    this.taskService.remove(this.task).subscribe(() => {
      this.closeModal();
      this.taskService.editTaskUpdated$.next({task: task, status: 'remove'});
      setTimeout(() => this.initTask(), 0);
    });
  }

  onMove(task: Task): void {
    this.counter = 0;
    this.taskMoveToggle = false;
    this.closeModal();
    this.taskService.editTaskUpdated$.next({task: task, status: 'move'});
    setTimeout(() => this.initTask(), 0);
  }

  close(): void {
    this.counter = 0;
    this.closeModal();
    this.taskService.editTaskUpdated$.next({task: this.initEditTask, status: 'update'});
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
    this.toastr.success('Saved');
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
