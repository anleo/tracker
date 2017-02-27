import { Component, OnInit } from '@angular/core';

import {Task} from '../models/task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  openHistory: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

}
