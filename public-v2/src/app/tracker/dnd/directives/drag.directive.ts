import {HostListener, Input, Directive, ElementRef} from "@angular/core";
import {DnDMessenger} from "../dnd.messenger";

@Directive({
  selector: '[drag]'
})
export class DragDirective {
  constructor(private elementRef: ElementRef,
              private dndMessenger: DnDMessenger) {
    this.dndMessenger.reset$.subscribe(flag => {
      if (flag) {
        this.reset();
      }
    });
  }

  @Input() dragItem;
  downEvent: Event = null;
  dragElement = this.elementRef.nativeElement;
  startElementCoordinates;
  dropListener = document.documentElement.querySelectorAll('[drop-listener]')[0];
  imActive: Boolean = false;

  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    let clickOnDragButton = event.target.classList.contains('drag-button');

    if (event.which === 1 && clickOnDragButton) {
      event.stopPropagation();
      this.init(event);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event) {
    if (this.downEvent) {
      !this.dropListener.classList.contains('moveCursor') && this.dropListener.classList.add('moveCursor');
    }
  }

  private init(event) {
    this.imActive = true;
    this.downEvent = event;

    this.dndMessenger.dragElement$.next(this.dragElement);
    this.dndMessenger.dragItem$.next(this.dragItem);
    this.dndMessenger.startElementPosition$.next(this.createStartElementPosition());

    this.dragElement.style.opacity = '0.3';
    this.dragElement.classList.add('i-drag');
    this.dragElement.classList.contains('pointer') && this.dragElement.classList.remove('pointer');

    document.ondragstart = function () {
      return false
    };

    document.body.onselectstart = function () {
      return false
    };
  }

  private createStartElementPosition() {
    return this.startElementCoordinates = {
      classList: this.dragElement.classList,
      opacity: this.dragElement.style.opacity || '',
    };
  }

  private reset() {
    if (this.imActive) {
      delete this.downEvent;
      delete this.startElementCoordinates;
      this.dropListener.classList.contains('moveCursor') && this.dropListener.classList.remove('moveCursor');
      this.dragElement.classList.contains('i-drag') && this.dragElement.classList.remove('i-drag');
      document.ondragstart = null;
      document.body.onselectstart = null;
    }
  }
}
