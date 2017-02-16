import {Injectable, Injector} from "@angular/core";
import {Http, RequestMethod} from "@angular/http";
import {Resource, ResourceAction, ResourceParams, ResourceMethod} from "ng2-resource-rest";
import {User} from "../model/user";
import {Password} from "../model/password";

@Injectable()
@ResourceParams({
  url: 'api/users'
})
export class UserResource extends Resource {
  user: User;

  constructor(http: Http, injector: Injector) {
    super(http, injector);
  }

  @ResourceAction({
    method: RequestMethod.Get,
    path: '/me'
  })
  get: ResourceMethod<null, User>;

  @ResourceAction({
    method: RequestMethod.Put,
    path: '/me'
  })
  save: ResourceMethod<User, User>;

  @ResourceAction({
    method: RequestMethod.Post,
    path: '/changePassword/?oldPassword={!oldPassword}&newPassword={!newPassword}'
  })
  editPassword: ResourceMethod<Password, any>;
}
