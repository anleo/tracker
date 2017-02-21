import {Component, OnInit, Output, EventEmitter} from '@angular/core';

import {Task} from '../../models/task';
import {TaskStatus} from '../../models/task-status';
import {TaskService} from "../../services/task.service";
import {TaskStatusService} from "../../services/task-status.service";
import {TaskComplexity} from "../../models/task-complexity";

@Component({
  selector: 'app-task-edit',
  templateUrl: 'task-edit.component.html'
})
export class TasksEditComponent implements OnInit {
  task: Task|null = null;
  @Output() onUpdate: EventEmitter<Task> = new EventEmitter();
  @Output() onRemove: EventEmitter<Task> = new EventEmitter();

  statuses: TaskStatus[] = [];
  // complexities: TaskComplexity;

  constructor(private taskService: TaskService,
              private taskStatusService: TaskStatusService) {
    this.taskService.editTask$.subscribe((task) => this.task = task);
  }

  ngOnInit() {
    this.task = this.task ? this.task : new Task();

    this.taskStatusService
      .getTaskStatusList()
      .subscribe(taskStatusList => this.statuses = taskStatusList)
  }

  initTask() {
    this.task = new Task();
  }

  save() {
    if (this.task && this.task.parentTaskId) {
      this.taskService.saveChildTask(this.task).subscribe((task) => {
        this.emitUpdate(task);
        this.initTask();
      });
    } else {
      this.taskService.save(this.task).subscribe((task) => {
        this.emitUpdate(task);
        this.initTask();
      });
    }
  }

  remove(task: Task) {
    this.taskService.remove(this.task).subscribe(() => {
      this.emitRemove(task);
      this.initTask();
    });
  }

  emitUpdate(task: Task) {
    this.onUpdate.emit(task);
  }

  emitRemove(task: Task) {
    this.onRemove.emit(task);
  }

  close() {
    this.initTask();
  }

  setStatus(status: string): void {
    this.task.status = status;
  }
}
