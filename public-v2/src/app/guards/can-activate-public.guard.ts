import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {UserService} from "../user/services/user.service";
import {Observable} from "rxjs";

@Injectable()

export class CanActivatePublicGuard implements CanActivate {
  stopCount = 1;
  callCount = 0;

  constructor(private router: Router, private userService: UserService) {}

  canActivate(): Observable<boolean> {
    if (!this.userService.user && this.callCount >= this.stopCount) {
      return Observable.of(true);
    }

    return this.userService.get()
      .map(user => {
        if (user) {
          this.router.navigate(['/app/tasks']);
          return false;
        }

        return true;
      })
      .catch((err) => {
        if (err.status === 401) {
          this.callCount++;
          return Observable.of(true);
        } else {
          return Observable.throw(err);
        }
      });
  }
}
