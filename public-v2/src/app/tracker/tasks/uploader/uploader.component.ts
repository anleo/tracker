import {Component, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {NgUploaderOptions} from 'ngx-uploader';

@Component({
  selector: 'uploader',
  templateUrl: './uploader.component.html',
})
export class UploaderComponent {
  files: Array<any> = [];
  dynamic: number = 0;
  uploading: boolean = false;

  options: NgUploaderOptions;
  response: any;

  @ViewChild('uploader') uploaderInput: ElementRef;

  @Output() onUpload: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.options = new NgUploaderOptions({
      url: '/api/files',
      autoUpload: true,
    });
  }

  handleUpload(data: any) {
        this.uploading = true;
        this.response = data;

        if (data && data.response) {
          this.response = JSON.parse(data.response);
          this.dynamic = 100;
          this.uploaderInput.nativeElement.value = '';

          setTimeout(() => {
            this.uploading = false;
            this.onUpload.emit(this.response);
            this.dynamic = 0;
          }, 3000)
        }
  }
}
