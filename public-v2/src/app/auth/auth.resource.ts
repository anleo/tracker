import {Injectable, Injector} from "@angular/core";
import {ResourceAction, ResourceMethod, ResourceParams, Resource} from "ng2-resource-rest";

import {Http, RequestMethod} from "@angular/http";
import {AuthUser} from "./AuthUser";
import {User} from "../user/model/user";

@Injectable()

@ResourceParams({
  url: '/api',
})

export class AuthResource extends Resource {
  constructor(http: Http,
              injector: Injector) {
    super(http, injector);
  }

  @ResourceAction({
    path: '/register',
    method: RequestMethod.Post
  })
  register: ResourceMethod<AuthUser, User>;

  @ResourceAction({
    path: '/login',
    method: RequestMethod.Post
  })
  login: ResourceMethod<AuthUser, User>;

  @ResourceAction({
    path: '/logout',
    method: RequestMethod.Get
  })
  logout: ResourceMethod<any, any>;

  @ResourceAction({
    path: '/resetPassword',
    method: RequestMethod.Post
  })
  resetPassword: ResourceMethod<{email: string}, any>;

  @ResourceAction({
    path: '/users/resetPassword?token={!token}&password={!password}',
    method: RequestMethod.Post
  })
  changePassword: ResourceMethod<any, any>;
}
