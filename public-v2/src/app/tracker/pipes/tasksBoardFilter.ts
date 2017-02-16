import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'tasksBoardFilter'})
export class TasksBoardFilter implements PipeTransform {
  transform(tasks: any, type: any): any {
    let results = [];

    tasks.map((task) => {
      if (task.status === type.value) {
        results.push(task);
      }
    });

    return results;
  }
}
