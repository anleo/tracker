import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

import {Task} from '../models/task';

@Injectable()
export class TaskMetricsService {
  task: Task|null = null;

  task$: BehaviorSubject<Task> = new BehaviorSubject<Task>(null);

  constructor() {
    this.task$.subscribe((task: Task) => this.task = task);
  }
}
