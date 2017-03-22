import {HostListener, Input, Directive, ElementRef} from "@angular/core";
import {DnDService} from "../dnd.service";

@Directive({
  selector: '[drag]'
})
export class DragDirective {
  constructor(private elementRef: ElementRef,
              private DnDService: DnDService) {
  }

  @Input() dragItem;
  downEvent: Event = null;
  dragElement = this.elementRef.nativeElement;
  startElementCoordinates;
  cloneElement;

  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    this.init(event);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event) {
    if (this.downEvent) {
      this.recalculateCoordinates(this.dragElement, event);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event) {
    if (this.downEvent) {
      this.reset();
    }
  }

  private init(event) {
    this.downEvent = event;
    this.createClone();
    this.dragElement.style.position = 'absolute';
    this.dragElement.style.zIndex = '1000';
    this.DnDService.dragElement$.next(this.dragElement);
    this.DnDService.dragItem$.next(this.dragItem);
    this.DnDService.startElementPosition$.next(this.createStartElementPosition());
    this.DnDService.cloneElement$.next(this.cloneElement);
  }

  private createClone() {
    this.cloneElement = this.dragElement.cloneNode(true);
    this.dragElement.parentNode.insertBefore(this.cloneElement, this.dragElement.nextSibling);
  }

  private recalculateCoordinates(element, event) {
    element.style.left = event.pageX - element.offsetWidth / 2 + 'px';
    element.style.top = event.pageY - element.offsetHeight / 2 + 'px';
  }

  private createStartElementPosition() {
    return this.startElementCoordinates = {
      parent: this.dragElement.parentNode,
      nextSibling: this.dragElement.nextSibling,
      position: this.dragElement.style.position || '',
      zIndex: this.dragElement.style.zIndex || '',
      left: this.dragElement.style.left || '',
      top: this.dragElement.style.top || ''
    };
  }

  private reset() {
    delete this.downEvent;
    delete this.cloneElement;
    delete this.startElementCoordinates;
  }
}
