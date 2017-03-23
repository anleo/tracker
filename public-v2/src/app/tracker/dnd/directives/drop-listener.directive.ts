import {HostListener, Directive} from "@angular/core";
import {DnDService} from "../dnd.service";

@Directive({
  selector: '[drop-listener]'
})
export class DropListenerDirective {
  dragElement;
  hasDropZone: boolean;

  constructor(private DnDService: DnDService) {
    this.DnDService.dragElement$.subscribe(dragElement => this.dragElement = dragElement);
    this.DnDService.hasDropZone$.subscribe(has => this.hasDropZone = has);
  }

  @HostListener('mouseup', ['$event'])
  mouseUp(event) {
    if (this.dragElement && !this.hasDropZone) {
      this.DnDService.reset();
    }
  }
}
