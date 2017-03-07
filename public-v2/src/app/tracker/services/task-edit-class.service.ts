import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from "rxjs";

import {Task} from '../models/task';
import {TaskNewService} from "./task-new.service";

@Injectable()
export class TaskEditClassService {
  place: string = 'base';
  taskId: string|null = null;

  tasks$: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>(null);

  places = {
    'base': 'getTasks',
    'archivedTasks': 'getArchivedTasks',
    'archivedProject': 'getArchivedProjects',
    'myTasks': 'getUserTasks'
  };


  constructor(private taskService: TaskNewService) {
  }

  getTasks() {
    let place = this.getMethodByPlace(this.place);

    if (!this.taskId) {
      this.taskService.getTasks(place, null).subscribe((tasks) => {
        console.log('place', tasks)
          this.tasks$.next(tasks);
          return tasks;
        }
      );
    }

    this.taskService.getTasks(place, this.taskId).subscribe((tasks) => {
        this.tasks$.next(tasks);
        return tasks;
      }
    );
  }

  getMethodByPlace(namePlace) {
    return this.places[namePlace];
  }

}

