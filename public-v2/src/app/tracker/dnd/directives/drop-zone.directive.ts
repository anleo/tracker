import {Directive, ElementRef, Input, Output, EventEmitter, HostListener} from "@angular/core";
import {DnDService} from "../dnd.service";

@Directive({
  selector: '[drop-zone]'
})
export class DropZoneDirective {
  @Output() onDrop: EventEmitter<any> = new EventEmitter();
  @Input() params: any;

  domElement = this.elementRef.nativeElement;
  dragItem;

  constructor(private elementRef: ElementRef,
              private DnDService: DnDService) {
    this.DnDService.dragItem$.subscribe((item) => this.dragItem = item);
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event) {
    event.stopPropagation();

    if (this.dragItem) {
      let data = {
        item: this.dragItem,
        params: this.params
      };

      this.onDrop.emit(data);
      this.DnDService.reset();
      this.reset();
    }
  }

  @HostListener('mouseover', ['$event'])
  onMouseEnter(event) {
    if (this.dragItem) {
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
