import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";

import {Task} from '../models/task';

@Injectable()
export class TaskMetricsService {
  task: Task|null = null;

  task$: Subject<Task> = new Subject<Task>();

  constructor() {
    this.task$.subscribe((task: Task) => this.task = task);
  }
}
