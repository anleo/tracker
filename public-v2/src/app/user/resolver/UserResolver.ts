import {Resolve, ActivatedRouteSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {UserService} from "../services/user.service";
import {User} from "../models/user";

@Injectable()
export class UserResolver implements Resolve<User> {
  constructor(private UserService: UserService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    return this.UserService.get();
  }
}
