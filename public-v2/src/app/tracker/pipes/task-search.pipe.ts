import {Pipe, PipeTransform} from '@angular/core';
import {Task} from "../models/task";

@Pipe({name: 'taskSearch'})
export class TaskSearchPipe implements PipeTransform {
  transform(tasks: Task[], searchString: string) {
    return  searchString
      ? tasks.filter(task => task.title.indexOf(searchString) != -1)
      : tasks;
  }
}
