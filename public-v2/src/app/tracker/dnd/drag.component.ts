import {HostListener, Input, Directive, ElementRef} from "@angular/core";
import {DnDService} from "./dnd.service";

@Directive({
  selector: '[drag]'
})
export class DragComponent {
  constructor(private elementRef: ElementRef,
              private DnDService: DnDService) {
  }

  @Input() item;
  downEvent: Event = null;
  element = this.elementRef.nativeElement;
  startElementCoordinate;

  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    if (!this.downEvent) {
      this.downEvent = event;

      this.startElementCoordinate = {
        parent: this.element.parentNode,
        nextSibling: this.element.nextSibling,
        position: this.element.style.position || '',
        left: this.element.style.left || '',
        top: this.element.style.top || '',
        zIndex: this.element.style.zIndex || ''
      };

      let body = document.documentElement.getElementsByTagName('body')[0];
      // body.appendChild(this.elementRef.nativeElement);

      body.addEventListener('mousemove', function () {
        console.log('eventlistener', arguments);
      },);
      this.element.style.position = 'absolute';
      this.element.style.zIndex = '9999';

      this.DnDService.startElementCoordinate$.next(this.startElementCoordinate);
      this.DnDService.domElement$.next(this.element);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event) {
    if (this.downEvent && this.item) {
      this.DnDService.dragItem$.next(this.item);
      let element = this.element;
      element.style.left = event.pageX - element.offsetWidth / 2 + 'px';
      element.style.top = event.pageY - element.offsetHeight / 2 + 'px';
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event) {
    if (this.downEvent) {
      delete this.downEvent;
      delete this.startElementCoordinate;
      delete this.item;
    }
  }

}
