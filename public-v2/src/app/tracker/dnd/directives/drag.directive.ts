import {HostListener, Input, Directive, ElementRef} from "@angular/core";
import {DnDService} from "../dnd.service";

@Directive({
  selector: '[drag]'
})
export class DragDirective {
  constructor(private elementRef: ElementRef,
              private DnDService: DnDService) {
    this.DnDService.reset$.subscribe(flag => {
        if (flag) {
          this.reset();
        }
      }
    )
  }

  @Input() dragItem;
  downEvent: Event = null;
  dragElement = this.elementRef.nativeElement;
  startElementCoordinates;
  dropListener = document.documentElement.querySelectorAll('[drop-listener]')[0];


  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    this.init(event);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event) {
    if (this.downEvent) {
      !this.dropListener.classList.contains('moveCursor') && this.dropListener.classList.add('moveCursor');
    }
  }

  private init(event) {
    this.downEvent = event;
    this.DnDService.dragElement$.next(this.dragElement);
    this.DnDService.dragItem$.next(this.dragItem);
    this.DnDService.startElementPosition$.next(this.createStartElementPosition());
    this.dragElement.style.opacity = '0.3';
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
      parent: this.dragElement.parentNode,
      nextSibling: this.dragElement.nextSibling,
      classList: this.dragElement.classList,
      opacity: this.dragElement.style.opacity || '',
      position: this.dragElement.style.position || '',
      zIndex: this.dragElement.style.zIndex || '',
      left: this.dragElement.style.left || '',
      top: this.dragElement.style.top || ''
    };
  }

  private reset() {
    delete this.downEvent;
    delete this.startElementCoordinates;
    this.dropListener.classList.contains('moveCursor') && this.dropListener.classList.remove('moveCursor');
    document.ondragstart = null;
    document.body.onselectstart = null;
  }
}
