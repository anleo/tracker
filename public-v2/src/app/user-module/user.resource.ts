import {Injectable, Injector} from "@angular/core";
import {Http, RequestMethod} from "@angular/http";
import {Resource, ResourceAction, ResourceParams, ResourceMethod} from "ng2-resource-rest";
import {User} from "./user";

@Injectable()
@ResourceParams({
  // TODO @@@id: check url
  url: 'api/users'
})
export class UserResource extends Resource {
  user: User;

  constructor(http: Http, injector: Injector) {
    super(http, injector);
  }

  @ResourceAction({
    method: RequestMethod.Get,
    port: 3000,
    path: '/me'
  })
  get: ResourceMethod<null, User>
}
