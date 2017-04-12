import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {DnDService} from "./dnd.service";

@Injectable()
export class DnDMessenger {
  dragItem$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  startElementPosition$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  dragElement$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  reset$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private dndService: DnDService) {
    this.dragItem$.subscribe(item => {
      this.dndService.dragItem$.next(item);
    });

    this.startElementPosition$.subscribe(coordinates => {
      this.dndService.startElementPosition$.next(coordinates);
    });

    this.dragElement$.subscribe(element => {
      this.dndService.dragElement$.next(element);
    });
  }

  reset() {
    this.dndService.reset();
    this.reset$.next(true);
    this.resetVariables();

  }

  private resetVariables() {
    this.startElementPosition$.next(null);
    this.dragElement$.next(null);
    this.dragItem$.next(null);
  }
}
