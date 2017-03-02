import {Injectable} from '@angular/core';
import {TaskResource} from "../resources/tasks.resource";

import {Task} from '../models/task';

@Injectable()

export class TaskSearchService {
  taskId: string = '';

  constructor(private taskResource: TaskResource) {
  }

  search(query: string, task:Task): Promise<Task[]> {
    return this.taskResource
      .search({
        taskId: task._id,
        query: query
      })
      .$observable
      .toPromise();
  }
}
