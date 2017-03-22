import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class DnDService {
  dragItem;
  startElementPositions;
  dragElement;
  dropParams;

  dragItem$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  startElementPosition$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  dragElement$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  turnonAction$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

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
  }

  cancelDrop() {
    this.resetElement();
    // this.resetVariables();
  }

  finishDrop(dropData) {
    let data = {
      flag: true,
      item: this.dragItem,
      params: dropData || null
    };

    this.turnonAction$.next(data);
    this.resetVariables();
  }

  private resetElement() {
    this.dragElement.style.position = this.startElementPositions.position;
    this.dragElement.style.left = this.startElementPositions.left;
    this.dragElement.style.top = this.startElementPositions.top;
    this.dragElement.style.zIndex = this.startElementPositions.zIndex;
    this.startElementPositions.parent.insertBefore(this.dragElement, this.startElementPositions.nextSibling);
  }

  private resetVariables() {
    this.startElementPosition$.next(null);
    this.dragElement$.next(null);
    this.dragItem$.next(null);
    this.turnonAction$.next({flag: false});
  }
}
