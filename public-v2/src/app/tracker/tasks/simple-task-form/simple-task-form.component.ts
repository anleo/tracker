import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';

import {Task} from '../../models/task';
import {TaskService} from "../../services/task.service";

@Component({
  selector: 'simple-task-form',
  templateUrl: 'simple-task-form.component.html',
})
export class SimpleTaskFormComponent implements OnInit {
  @Input() parentTask: Task|null = null;
  @Output() taskSaved = new EventEmitter();
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
      this.taskService
        .saveChildTask(this.task)
        .toPromise()
        .then((task) => setTimeout(() => {
          this.initTask();
          this.taskSaved.emit(task);
        }, 0))
        .catch((err) => console.log(err));
    } else {
      this.taskService
        .save(this.task)
        .toPromise()
        .then((task) => setTimeout(() => {
          this.initTask();
          this.taskSaved.emit(task);
        }, 0))
        .catch((err) => console.log(err));
    }
  }

  reset(): void {
    setTimeout(() => this.initTask(), 0);
  }
}
