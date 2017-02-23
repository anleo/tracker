import {Injectable, Injector} from '@angular/core';
import {RequestMethod, Http} from '@angular/http';

import {Resource, ResourceAction, ResourceMethod, ResourceResult, ResourceParams} from 'ng2-resource-rest';

@Injectable()
@ResourceParams({
  url: '/api'
})
export class FileResourse extends Resource {
  constructor(http: Http, injector: Injector) {
    super(http, injector);
  }

  @ResourceAction({
    method: RequestMethod.Delete,
    path: '/tasks/{!taskId}/files/{!fileId}'
  })
  delete: ResourceMethod<{taskId: string, fileId: string}, any>;
}
