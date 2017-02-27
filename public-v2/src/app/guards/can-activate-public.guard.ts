import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {UserService} from "../user/services/user.service";
import {Observable} from "rxjs";

@Injectable()

export class CanActivatePublicGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService) {}

  canActivate(): Observable<boolean> {
    return this.userService.get()
      .map(user => {
        if (user) {
          this.router.navigate(['/app/tasks']);
          return false;
        }
        return true;
      });
  }
}
