import {Component, Input, OnInit} from '@angular/core';

import {Task} from '../../models/task';
import {TaskService} from "../../services/task.service";

@Component({
  selector: 'simple-task-form',
  templateUrl: 'simple-task-form.component.html',
})
export class SimpleTaskFormComponent implements OnInit {
  @Input() parentTask: Task|null = null;
  task: Task|null = null;

  constructor(private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.initTask();
  }

  initTask() {
    this.task = new Task();
    this.task.parentTaskId = this.parentTask && this.parentTask._id;
  }

  save(): void {
    if (this.task && this.task.parentTaskId) {
      this.taskService.saveChildTask(this.task).subscribe((task) => setTimeout(() => this.initTask(), 0));
    } else {
      this.taskService.save(this.task).subscribe((task) => setTimeout(() => this.initTask(), 0));
    }
  }

  reset(): void {
    setTimeout(() => this.initTask(), 0);
  }
}
