import { Pipe, PipeTransform } from '@angular/core';

import {Task} from '../models/task';

@Pipe({name: 'tasksBoardFilter'})
export class TasksBoardFilter implements PipeTransform {
  transform(tasks: Task[], type: any): Task[] {
    let results = [];

    tasks.map((task) => {
      if (task.status === type.value) {
        results.push(task);
      }
    });

    return results;
  }
}
