import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class DnDService {
  dragItem;
  startElementCoordinate;
  dragElement;

  dragItem$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  startElementPosition$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  dragElement$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  turnonAction$: BehaviorSubject<any> = new BehaviorSubject<any>(false);


  constructor() {
    this.dragItem$.subscribe(item => {
      this.dragItem = item;
    });

    this.startElementPosition$.subscribe(coordinates => {
      this.startElementCoordinate = coordinates;
    });

    this.dragElement$.subscribe(element => {
      this.dragElement = element;
    });
  }

  cancelDrop() {
    this.resetElement();
    // this.dragItem$.next(null);
  }

  finishDrop() {
    let data = {
      flag: true,
      item: this.dragItem
    };

    this.turnonAction$.next(data);
    this.resetVariables();
  }

  private resetVariables() {
    this.startElementPosition$.next(null);
    this.dragElement$.next(null);
    this.dragItem$.next(null);
  }

  private resetElement() {
    this.dragElement.style.position = this.startElementCoordinate.position;
    this.dragElement.style.left = this.startElementCoordinate.left;
    this.dragElement.style.top = this.startElementCoordinate.top;
    this.dragElement.style.zIndex = this.startElementCoordinate.zIndex;
    this.startElementCoordinate.parent.insertBefore(this.dragElement, this.startElementCoordinate.nextSibling);
    // this.startElementPosition$.next(null);
    // this.dragElement$.next(null);
  }

}
