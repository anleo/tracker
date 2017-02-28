import { Pipe, PipeTransform } from '@angular/core';

import {Task} from '../models/task';

@Pipe({
  name: 'tasksBoardFilter',
  pure: false
})
export class TasksBoardFilter implements PipeTransform {
  transform(tasks: Task[], type: any): Task[] {
    tasks = tasks.map((task) => {
      if (task.status === type.value) {
        return task;
      }
    });

    return tasks;
  }
}
