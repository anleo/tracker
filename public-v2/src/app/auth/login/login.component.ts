import {Component} from '@angular/core';
import {AuthUser} from "../AuthUser";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  user: AuthUser = new AuthUser();

  constructor(private authService: AuthService,
              private router: Router) {
  }

  login(): void {
    this.authService
      .login(this.user)
      .then(() => this.router.navigate(['/app/tasks']))
      .catch((err: any) => console.log(err));
  }
}
