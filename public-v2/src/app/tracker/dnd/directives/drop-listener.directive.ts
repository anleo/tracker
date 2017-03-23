import {HostListener, Directive, EventEmitter, Output} from "@angular/core";
import {DnDService} from "../dnd.service";

@Directive({
  selector: '[drop-listener]'
})
export class DropListenerDirective {
  @Output() actionOnDrop: EventEmitter <any> = new EventEmitter();
  dragElement;

  constructor(private DnDService: DnDService) {
    this.DnDService.dragElement$.subscribe(dragElement => this.dragElement = dragElement);
    this.DnDService.turnonAction$.subscribe((data) => {
      this.turnonAction(data);
    });
  }

  @HostListener('mouseup', ['$event'])
  mouseUp(event) {
    if (this.dragElement) {
      this.finishDrop(event);
    }
  }

  @HostListener('mousedown', ['$event'])
  mouseDown(event) {
    document.documentElement.ondragstart = function () {
      return false
    };
    document.documentElement.getElementsByTagName('body')[0].onselectstart = function () {
      return false
    }
  }

  @HostListener('mouseleave', ['$event'])
  mouseLeave(event) {
    if (this.dragElement) {
      this.DnDService.cancelDrop();
    }
  }

  @HostListener('mousemove', ['$event'])
  mouseMove(event) {
    if (this.dragElement) {
   this.findClosestSibling(event);
    }
  }


  findClosestSibling(event) {
    this.dragElement.hidden = true;
    let closestItem = document.elementFromPoint(event.clientX, event.clientY);
    this.dragElement.hidden = false;
  }

  private finishDrop(event) {
    this.dragElement.hidden = true;
    let dropData = this.findDropZoneAndParams(event);
    this.dragElement.hidden = false;

    if (!dropData.dropZone) {
      this.DnDService.cancelDrop();
    } else {
      this.DnDService.finishDrop(dropData.dropParams);
    }
  }

  private turnonAction(data) {
    if (data.flag) {
      let dropData = {
        item: data.item,
        params: data.params
      };

      this.actionOnDrop.next(dropData);
    }
  }

  private findDropZoneAndParams(event) {
    let dropData = {dropZone: null, dropParams: null};
    let elementByCoordinates = document.elementFromPoint(event.clientX, event.clientY);
    let foundElement = elementByCoordinates.closest('[drop-zone]');

    if (foundElement) {
      dropData.dropZone = foundElement;
      let dropParams = dropData.dropZone.attributes['dropParams'];

      if (dropParams) {
        dropData.dropParams = JSON.parse(dropParams.value);
      }
    }

    return dropData;
  }
}
