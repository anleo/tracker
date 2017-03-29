import {Directive, ElementRef, Input, Output, EventEmitter, HostListener} from "@angular/core";
import {DnDService} from "../dnd.service";

@Directive({
  selector: '[drop-zone]'
})
export class DropZoneDirective {
  @Output() onDrop: EventEmitter<any> = new EventEmitter();
  @Input() dropParams: any;

  domElement = this.elementRef.nativeElement;
  dragItem;

  constructor(private elementRef: ElementRef,
              private DnDService: DnDService) {
    this.DnDService.dragItem$.subscribe((item) => this.dragItem = item);
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
        this.onDrop.emit(data);
      }

      this.DnDService.reset();
      this.reset();
    }
  }

  @HostListener('mouseover', ['$event'])
  onMouseEnter(event) {
    let imDrag = this.domElement.classList.contains('i-drag');

    if (this.dragItem && !imDrag) {
      event.stopPropagation();
      this.DnDService.setDropZone$.next(true);
      this.domElement.classList.add('drop-zone');
    }
  }

  @HostListener('mouseout', ['$event'])
  onMouseLeave(event) {
    if (this.dragItem) {
      event.stopPropagation();
      this.DnDService.setDropZone$.next(false);
      this.domElement.classList.remove('drop-zone');
    }
  }

  reset() {
    this.DnDService.setDropZone$.next(false);
    this.domElement.classList.remove('drop-zone');
  }

}
