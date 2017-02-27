import { Component } from '@angular/core';

import {Task} from '../models/task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html'
})
export class TasksComponent {
  tasks: Task[] = [];
  openHistory: boolean = false;
}
