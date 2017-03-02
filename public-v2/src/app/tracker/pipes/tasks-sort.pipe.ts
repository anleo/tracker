import {Pipe, PipeTransform} from '@angular/core';
import {Task} from "../models/task";

@Pipe({name: 'tasksSort'})

export class TasksSortPipe implements PipeTransform {
  private sortTypes: Array<string> = ['asc', 'desc'];
  private sortType: string = 'asc';

  transform(tasks: Task[], sortParams: {field: string, type: string}): Task[] {

    if (sortParams.hasOwnProperty('type')) {
      if (this.sortTypeExist(sortParams.type)) {
        this.sortType = sortParams.type;
      } else {
        console.warn('Sort Type ' + sortParams.type + ' no supported');
      }
    }

    tasks.sort((curr: Task, next: Task) => {
      if (
        curr.hasOwnProperty(sortParams.field) &&
        next.hasOwnProperty(sortParams.field)
      ) {
        if (curr[sortParams.field] < next[sortParams.field]) {
          return this.sortType === 'asc' ? -1 : 1;
        }
        else if (curr[sortParams.field] > next[sortParams.field]) {
          return this.sortType === 'asc' ? 1 : -1;
        }
        else {
          return 0
        }
      }
    });

    return tasks;
  }

  private sortTypeExist(type): boolean {
    return this.sortTypes.indexOf(type) >= 0 ? true : false;
  }
}
