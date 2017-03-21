import {HostListener, Directive, ElementRef, EventEmitter, Output} from "@angular/core";
import {DnDService} from "./dnd.service";

@Directive({
  selector: '[drop-listener]'
})
export class DropDirective {
  constructor(private DnDService: DnDService) {
    this.DnDService.dragElement$.subscribe(dragElement => this.dragElement = dragElement);
    this.DnDService.turnonAction$.subscribe((data) => {
      if (data.flag) {
        this.actionOnDrop.next(data.item);
      }
    });
  }

  @Output() actionOnDrop: EventEmitter <any> = new EventEmitter();
  dragElement;

  @HostListener('mouseup', ['$event'])
  onMouseUp(event) {
    if (this.dragElement) {
      this.dragElement.hidden = true;
      let dropZone = this.findDropZone(event);
      this.dragElement.hidden = false;

      if (!dropZone) {
        this.DnDService.cancelDrop();
      } else {
        this.DnDService.finishDrop();
      }
    }
  }

  private findDropZone(event) {
    let dropZone = null;
    let element = document.elementFromPoint(event.clientX, event.clientY);
    if (element.attributes['class'] && element.attributes['class'].value === 'drop-zone') {
      dropZone = element.attributes['class'].value;
    }

    return dropZone;
  }

}

// @Directive({
//   selector: '[drop-zone]'
// })
// export class DropZoneDirective {
//   constructor(private DnDService: DnDService,
//               private elementRef: ElementRef) {
//   }
//
//   @Output() action: EventEmitter <any> = new EventEmitter();
//   el = this.elementRef.nativeElement;
//
//   @HostListener('mouseenter', ['$event'])
//   onMouseOver(event) {
//     event.stopPropagation();
//     console.log('over enter', event);
//     this.DnDService.dropZoneChange$.next(this.el);
//   }
// }
