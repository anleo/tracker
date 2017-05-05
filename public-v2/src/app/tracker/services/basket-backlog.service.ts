import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class BasketBacklogService {
  constructor() {
  }

  basketToggle$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  backlogToggle$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
}

