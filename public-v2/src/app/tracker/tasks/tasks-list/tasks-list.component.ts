import { Component, OnInit } from '@angular/core';
import {Task} from '../../models/task'

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html'
})
export class TasksListComponent implements OnInit {
  tasks: Task[] = [];
  constructor() { }

  ngOnInit() {
  }

}
