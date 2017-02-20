import {Injectable} from '@angular/core';
import {TaskStatusMock} from '../mocks/task-status.mock';
import {TaskStatus} from "../models/task-status";
import {Observable} from "rxjs/Observable";

@Injectable()
export class TaskStatusService {

  getTaskStatusList(): Observable<TaskStatus[]> {
    return Observable.of(TaskStatusMock);
  }

  getById(id: string): Observable<TaskStatus>{
    return Observable.of(TaskStatusMock.find(status => status.id === id))
  }
}
