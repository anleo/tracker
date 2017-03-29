import {Component, Input} from '@angular/core';

import {Task} from '../../models/task'

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html'
})
export class TasksListComponent {
  @Input() tasks: Task[];
  @Input() board;

  onDropToTask(dropData) {
    console.log('dropDarta to task', dropData);
  }
}
