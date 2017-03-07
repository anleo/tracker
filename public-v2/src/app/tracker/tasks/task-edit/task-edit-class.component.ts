import {Component, OnInit} from '@angular/core';

import {TaskEditClassService} from "../../services/task-edit-class.service";
import {Task} from '../../models/task';

@Component({
  selector: 'task-edit-class',
  template: '<h1>edit</h1><button (click)="getTasks()">GetTasks</button>' +
  '<ul><li *ngFor="let task of tasks">' +
  'jjjjj' +
  '{{task.title}}</li></ul>',
  providers: [TaskEditClassService]
})

export class TaskEditClassComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskEditClassService: TaskEditClassService) {
  }

  ngOnInit() {
    this.taskEditClassService.tasks$.subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      console.log('tasks', tasks);
      console.log('this.tasks', this.tasks);
    });
    this.getTasks();
  }

  getTasks(): void {
    this.taskEditClassService.getTasks();
  }
}
