import {Injectable, EventEmitter} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class DnDService {
  dragItem;
  dropZone;
  startElementCoordinate;
  domElement;

  dropZoneChange$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  dragItem$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  startElementCoordinate$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  domElement$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() {
    this.dropZoneChange$.subscribe(zone => {
      this.dropZone = zone;
    });

    this.dragItem$.subscribe(item => {
      this.dragItem = item;
    });

    this.startElementCoordinate$.subscribe(coordinates => {
      this.startElementCoordinate = coordinates;
    });

    this.domElement$.subscribe(element => {
      this.domElement = element;
    });
  }

  onMouseUp() {
    if (this.dragItem && this.dropZone) {
      this.domElement.parentNode.removeChild(this.domElement);
      this.dragItem$.next(null);
      this.dropZoneChange$.next(null);
      this.domElement$.next(null);
      this.startElementCoordinate$.next(null);
    } else {
      this.cancel();
    }
  }

  cancel() {
    if (this.domElement && this.startElementCoordinate) {
      this.resetElement();
      this.dragItem$.next(null);
      this.dropZoneChange$.next(null);
    }
  }

  private resetElement() {
    console.log('this.startElementCoordinate', this.startElementCoordinate);
    this.startElementCoordinate.parent.insertBefore(this.domElement, this.startElementCoordinate.nextSibling);
    this.domElement.style.position = this.startElementCoordinate.position;
    this.domElement.style.left = this.startElementCoordinate.left;
    this.domElement.style.top = this.startElementCoordinate.top;
    this.domElement.style.zIndex = this.startElementCoordinate.zIndex;
    this.startElementCoordinate$.next(null);
    this.domElement$.next(null);
  }

}
