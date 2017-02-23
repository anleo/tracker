import {Component, NgZone, Inject, Output, EventEmitter} from '@angular/core';
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

  @Output() onUpload: EventEmitter<any> = new EventEmitter();

  constructor(@Inject(NgZone) private zone: NgZone) {
    this.options = new NgUploaderOptions({
      url: '/api/files',
      autoUpload: true,
      calculateSpeed: true
    });
  }

  handleUpload(data: any) {
    setTimeout(() => {
      this.zone.run(() => {
        this.uploading = true;
        this.response = data;

        if (data && data.response) {
          this.response = JSON.parse(data.response);
          this.dynamic = 100;

          setTimeout(() => {
            this.uploading = false;
            this.onUpload.emit(this.response);
            this.dynamic = 0;
          }, 3000)
        }
      });
    });
  }
}
