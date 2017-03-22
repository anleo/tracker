import {Directive, ElementRef, Input, OnInit} from "@angular/core";

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
