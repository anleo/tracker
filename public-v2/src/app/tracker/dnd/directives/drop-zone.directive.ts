import {Directive, ElementRef, Input, HostListener} from "@angular/core";
import {DnDService} from "../dnd.service";

@Directive({
  selector: '[drop-zone]'
})
export class DropZoneDirective {
  @Input() dropParams: any;

  domElement = this.elementRef.nativeElement;
  dragItem;

  constructor(private elementRef: ElementRef,
              private dnDService: DnDService) {
    this.dnDService.dragItem$.subscribe((item) => this.dragItem = item);
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event) {
    if (this.dragItem) {

      let imDrag = this.domElement.classList.contains('i-drag');

      let data = {
        item: this.dragItem,
        params: this.dropParams
      };

      if (!imDrag) {
        event.stopPropagation();
        this.dnDService.onDrop$.next(data);
      }

      this.dnDService.reset();
      this.reset();
    }
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(event) {
    let imDrag = this.domElement.classList.contains('i-drag');

    if (this.dragItem && !imDrag) {
      event.stopPropagation();
      this.dnDService.setDropZone$.next(true);
      this.domElement.classList.add('drop-zone');
    }
  }

  @HostListener('mouseout', ['$event'])
  onMouseOut(event) {
    if (this.dragItem) {
      event.stopPropagation();
      this.dnDService.setDropZone$.next(false);
      this.domElement.classList.remove('drop-zone');
    }
  }

  reset() {
    this.dnDService.setDropZone$.next(false);
    this.domElement.classList.remove('drop-zone');
  }

}
