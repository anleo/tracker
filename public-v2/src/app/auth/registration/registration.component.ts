import {Component} from '@angular/core';
import {AuthService} from "../auth.service";
import {AuthUser} from "../AuthUser";
import {Router} from "@angular/router";
import {User} from "../../user/User";

@Component({
  selector: 'app-registration',
  templateUrl: 'registration.component.html'
})
export class RegistrationComponent {
  user: AuthUser = new AuthUser();

  constructor(private authService: AuthService,
  private router: Router) {
  }

  register(): void {
    this.authService
      .register(this.user)
      .then((user: User) => this.router.navigate(['/app/tasks']))
      .catch((err: any) => {
        console.log(err);
      })
  }

}
