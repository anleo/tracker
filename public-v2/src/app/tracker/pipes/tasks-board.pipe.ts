import {Pipe, PipeTransform} from '@angular/core';

import {Task} from '../models/task';

@Pipe({
  name: 'tasksBoardFilter',
  pure: false
})
export class TasksBoardFilter implements PipeTransform {
  transform(tasks: Task[], type: any): Task[] {
    return tasks.filter(task => task.status === type.value);
  }
}
