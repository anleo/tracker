import {Directive, ElementRef, Input, HostListener} from "@angular/core";
import * as _ from "lodash";
import {DnDService} from "../dnd.service";
import {DnDMessenger} from "../dnd.messenger";

@Directive({
  selector: '[drop-zone]'
})
export class DropZoneDirective {
  @Input() dropParams: any;
  @Input() check = [];

  domElement = this.elementRef.nativeElement;
  dragItem;

  constructor(private elementRef: ElementRef,
              private dndService: DnDService,
              private dndMessenger: DnDMessenger) {
    this.dndMessenger.dragItem$.subscribe((item) => this.dragItem = item);
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event) {
    if (this.dragItem) {

      let imDrag = this.domElement.classList.contains('i-drag');

      let data = {
        item: this.dragItem,
        params: this.dropParams
      };

      if (!imDrag && this.checking()) {
        event.stopPropagation();
        this.dndService.onDrop$.next(data);
      }

      this.dndMessenger.reset();
      this.reset();
    }
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(event) {
    let imDrag = this.domElement.classList.contains('i-drag');

    if (this.dragItem && !imDrag && this.checking()) {
      event.stopPropagation();
      this.dndService.hasDropZone$.next(true);
      this.domElement.classList.add('drop-zone');
    }
  }

  @HostListener('mouseout', ['$event'])
  onMouseOut(event) {
    if (this.dragItem) {
      event.stopPropagation();
      this.dndService.hasDropZone$.next(false);
      this.domElement.classList.remove('drop-zone');
    }
  }

  reset() {
    this.dndService.hasDropZone$.next(false);
    this.domElement.classList.remove('drop-zone');
  }

  private checking() {
    let checkResult = true;
    let self = this;

    _.isArray(this.check) && _.forEach(this.check, (check) => {
      if (_.isFunction(check) && !check(self.dragItem)) {
        checkResult = false;
      }
    });

    return checkResult;
  }

}
