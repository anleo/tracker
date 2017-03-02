import {Component, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'file-viewer',
  templateUrl: './file-viewer.component.html'
})
export class FileViewerComponent {
  @Input() files: Array<any> = [];
  @Input() isDeletable: boolean = false;
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  isImage(file: any) {
    return /\.(jpg|jpeg|png|gif|bmp)$/i.test(file);
  }

  deleteFile(file: any) {
    this.onDelete.emit(file);
  }

}
