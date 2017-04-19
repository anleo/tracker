import {Pipe, PipeTransform} from '@angular/core';
import {SortByFieldsPipe} from "./sort-by-fields.pipe";

import {Task} from "../models/task";

@Pipe({name: 'tasksSort'})

export class TasksSortPipe extends SortByFieldsPipe implements PipeTransform {
  defaultSortingParams = {
    fields: ['priority', 'updatedAt'],
    orders: ['desc', 'asc']
  };

  transform(tasks: Task[], sortParams) {
    return super.transform(tasks, sortParams);
  }
}
