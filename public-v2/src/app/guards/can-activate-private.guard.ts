import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {UserService} from "../user/services/user.service";
import {Observable} from "rxjs";

@Injectable()

export class CanActivatePrivateGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(): Observable<boolean> {
    if (this.userService.user) {
      return Observable.of(true);
    }

    return this.userService.get()
      .map(user => {
        if (user) {
          return false;
        }

        this.router.navigate(['/app/login']);
        return true;
      })
      .catch((err) => {
        if (err.status === 401) {
          return Observable.of(false);
        } else {
          return Observable.throw(err);
        }
      });
  }
}
