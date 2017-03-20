import {HostListener, Input, Directive, ElementRef, Output, EventEmitter} from "@angular/core";
import {DnDService} from "./dnd.service";

@Directive({
  selector: '[drop-listener]'
})
export class DropDirective {
  constructor(private DnDService: DnDService,
              private elementRef: ElementRef) {
    this.DnDService.dragItem$.subscribe(item => this.dragItem = item)
    this.DnDService.domElement$.subscribe(dom => this.dom = dom)
    // this.DnDService.dropZoneChange$.subscribe(dropZone => this.dropZone = dropZone)
  }

  el = this.elementRef.nativeElement;
  dragItem;
  dropZone;
  dom;

  @HostListener('mouseup', ['$event'])
  onMouseUp(event) {
    console.log('mouseup', event);

    this.dom.hidden = true;
    let dropPositionElement = document.elementFromPoint(event.clientX, event.clientY);

    if (dropPositionElement.attributes['id'] && dropPositionElement.attributes['drop-zone']) {
      let json = JSON.parse(dropPositionElement.attributes['params'].value);
      console.log(dropPositionElement.attributes['id'].value)
    }

    this.DnDService.onMouseUp();
  }

}

@Directive({
  selector: '[drop-zone]'
})
export class DropZoneDirective {
  constructor(private DnDService: DnDService,
              private elementRef: ElementRef) {
  }

  @Output() action: EventEmitter <any> = new EventEmitter();
  el = this.elementRef.nativeElement;

  @HostListener('mouseenter', ['$event'])
  onMouseOver(event) {
    event.stopPropagation();
    console.log('over enter', event);
    this.DnDService.dropZoneChange$.next(this.el);
  }
}
