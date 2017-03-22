import {HostListener, Directive, ElementRef, EventEmitter, Output, Input, OnInit} from "@angular/core";
import {DnDService} from "./dnd.service";

@Directive({
  selector: '[drop-listener]'
})
export class DropDirective {
  constructor(private DnDService: DnDService) {
    this.DnDService.dragElement$.subscribe(dragElement => this.dragElement = dragElement);
    this.DnDService.turnonAction$.subscribe((data) => {
      if (data.flag) {
        let dropData = {
          item: data.item,
          params: data.params
        };

        this.actionOnDrop.next(dropData);
      }
    });
  }

  @Output() actionOnDrop: EventEmitter <any> = new EventEmitter();
  dragElement;

  @HostListener('mouseup', ['$event'])
  onMouseUp(event) {
    if (this.dragElement) {
      this.dragElement.hidden = true;
      let dropData = this.findDropZoneAndParams(event);
      this.dragElement.hidden = false;

      if (!dropData.dropZone) {
        this.DnDService.cancelDrop();
      } else {
        this.DnDService.finishDrop(dropData.dropParams);
      }
    }
  }

  private findDropZoneAndParams(event) {
    let dropData = {dropZone: null, dropParams: null};
    let elementByCoordinates = document.elementFromPoint(event.clientX, event.clientY);
    let foundElement = elementByCoordinates.closest('.drop-zone');

    if (foundElement.attributes['class'] && /drop-zone/.test(foundElement.attributes['class'].value)) {
      dropData.dropZone = foundElement;

      if (dropData.dropZone.attributes['dropParams']) {
        dropData.dropParams = JSON.parse(dropData.dropZone.attributes['dropParams'].value);
      }
    }

    return dropData;
  }

}

@Directive({
  selector: '[drop-zone]'
})
export class DropZoneDirective implements OnInit {
  constructor(private elementRef: ElementRef) {
  }

  @Input() params: any;
  @Input() toItem: Object;
  domElement = this.elementRef.nativeElement;

  ngOnInit(): void {
    if (this.params) {

      if (this.toItem) {
        this.params.toItem = this.toItem;
      }

      this.domElement.setAttribute('dropParams', JSON.stringify(this.params))
    }
  }
}
