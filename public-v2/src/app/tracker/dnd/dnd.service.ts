import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable()
export class DnDService {
  dragItem;
  startElementPositions;
  dragElement;

  dragItem$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  startElementPosition$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  dragElement$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  setDropZone$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  hasDropZone$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  reset$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  onDrop$: Subject<any> = new Subject <any>();

  constructor() {
    this.dragItem$.subscribe(item => {
      this.dragItem = item;
    });

    this.startElementPosition$.subscribe(coordinates => {
      this.startElementPositions = coordinates;
    });

    this.dragElement$.subscribe(element => {
      this.dragElement = element;
    });

    this.setDropZone$.subscribe(has => {
      this.hasDropZone$.next(has);
    });

  }

  reset() {
    this.resetElement();
    this.resetVariables();
  }

  private resetElement() {
    this.dragElement.classList = this.startElementPositions.classList;
    this.dragElement.style.opacity = this.startElementPositions.opacity;
    this.reset$.next(true);
  }

  private resetVariables() {
    this.startElementPosition$.next(null);
    this.dragElement$.next(null);
    this.dragItem$.next(null);
  }
}
