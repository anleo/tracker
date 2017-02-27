import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';

import {Task} from '../../models/task';
import {TaskStatus} from '../../models/task-status';
import {TaskService} from "../../services/task.service";
import {TaskStatusService} from "../../services/task-status.service";
import {TaskPrioritiesMock} from '../../mocks/task-priorities.mock';

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

  constructor(private taskService: TaskService,
              private taskStatusService: TaskStatusService) {
  }

  ngOnInit(): void {
    this.taskService.task$.subscribe((task) => {
      this.parentTask = task ? task : null;

      this.taskService.editTask$.subscribe((task) => {
        this.task = task ? task : new Task();

        if (this.task && !this.task.parentTaskId && this.parentTask) {
          this.task.parentTaskId = this.parentTask && this.parentTask._id;
        }

        this.taskStatusService
          .getTaskStatusList()
          .subscribe(taskStatusList => this.statuses = taskStatusList);
      });
    });

  }

  initTask(): void {
    this.task = new Task();
    this.task.parentTaskId = this.parentTaskId;
    this.taskService.editTask$.next(this.task);
  }

  save(): void {
    if (this.task && this.task.parentTaskId) {
      this.taskService.saveChildTask(this.task).subscribe((task) => this.reinitTask(task));
    } else {
      this.taskService.save(this.task).subscribe((task) => this.reinitTask(task));
    }
  }

  reinitTask(task: Task): void {
    this.taskService.editTaskUpdated$.next({task: task, status: 'update'});
    setTimeout(() => this.initTask(), 0);
  }

  remove(task: Task): void {
    this.taskService.remove(this.task).subscribe(() => {
      this.taskService.editTaskUpdated$.next({task: task, status: 'remove'});
      setTimeout(() => this.initTask(), 0);
    });
  }

  onMove(task: Task):void {
    this.taskMoveToggle = false;
    this.taskService.editTaskUpdated$.next({task: task, status: 'move'});
    setTimeout(() => this.initTask(), 0);
  }

  close(): void {
    this.taskService.editTaskUpdated$.next({task: null, status: 'close'});
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
      .subscribe(() => this.task.files.splice(this.task.files.indexOf(file), 1))
  }

  showTaskMove(): void {
    this.taskMoveToggle = !this.taskMoveToggle;
  }
}
