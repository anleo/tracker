import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

import {Task} from '../models/task';

@Injectable()
export class CurrentTaskService {
  task: Task|null = null;
  rootTask: Task|null = null;
  parentTask: Task|null = null;

  task$: BehaviorSubject<Task> = new BehaviorSubject<Task>(null);
  rootTask$: BehaviorSubject<Task> = new BehaviorSubject<Task>(null);
  parentTask$: BehaviorSubject<Task> = new BehaviorSubject<Task>(null);

  constructor() {
    this.task$.subscribe((task: Task) => this.task = task);
    this.rootTask$.subscribe((rootTask: Task) => this.rootTask = rootTask);
    this.parentTask$.subscribe((parentTask: Task) => this.parentTask = parentTask);
  }

}

