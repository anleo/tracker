import {Component, OnInit} from '@angular/core';

import {Task} from '../../models/task';
import {TaskService} from "../../services/task.service";

@Component({
  selector: 'app-task-edit-modal',
  templateUrl: 'task-edit-modal.component.html'
})
export class TasksEditModalComponent implements OnInit {
  task: Task|null = null;
  parentTaskId: string|null = null;

  constructor(private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.taskService.editTaskModal$.subscribe((task) => {
      this.task = task;
      if (task && task.parentTaskId) {
        this.parentTaskId = task.parentTaskId;
      }
    });
  }

  onClose(): void {
    this.task = null;
  }
}
