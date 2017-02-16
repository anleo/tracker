import {Resolve, ActivatedRouteSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {UserService} from "../service/user.service";
import {User} from "../model/user";

@Injectable()
export class UserResolver implements Resolve<User> {
  constructor(private UserService: UserService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    console.log('resolver');
    return this.UserService.get();
  }
}
