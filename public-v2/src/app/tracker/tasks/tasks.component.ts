import { Component, OnInit } from '@angular/core';
import {TaskService} from "../services/task.service";
import {Task} from '../models/task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  openHistory: boolean = false;

  constructor(private taskService:TaskService) { }

  ngOnInit() {
    this.taskService.getTasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }

}
