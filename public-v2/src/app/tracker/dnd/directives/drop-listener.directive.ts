import {HostListener, Directive} from "@angular/core";
import {DnDService} from "../dnd.service";
import {DnDMessenger} from "../dnd.messenger";

@Directive({
  selector: '[drop-listener]'
})
export class DropListenerDirective {
  dragElement;
  hasDropZone: boolean;

  constructor(private dndService: DnDService,
              private dndMessenger: DnDMessenger) {
    this.dndMessenger.dragElement$.subscribe(dragElement => this.dragElement = dragElement);
    this.dndService.hasDropZone$.subscribe(has => this.hasDropZone = has);
  }

  @HostListener('mouseup', ['$event'])
  mouseUp(event) {
    if (this.dragElement && !this.hasDropZone) {
      this.dndMessenger.reset();
    }
  }
}
