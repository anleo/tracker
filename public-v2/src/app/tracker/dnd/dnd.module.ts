import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DragDirective} from "./directives/drag.directive";
import {DropListenerDirective} from "./directives/drop-listener.directive";
import {DropZoneDirective} from "./directives/drop-zone.directive";
import {DnDService} from "./dnd.service";

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    DragDirective,
    DropListenerDirective,
    DropZoneDirective
  ],
  declarations: [
    DragDirective,
    DropListenerDirective,
    DropZoneDirective
  ],
  providers: [
    DnDService
  ]
})
export class DragAndDropModule {
}
