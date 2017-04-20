import {Component} from '@angular/core';
import {Router} from "@angular/router";

import {AuthUser} from "../AuthUser";
import {AuthService} from "../auth.service";
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  user: AuthUser = new AuthUser();

  constructor(private authService: AuthService,
              private router: Router,
              public toastService: ToastService) {
  }

  login(): void {
    this.authService
      .login(this.user)
      .then(() => this.router.navigate(['/app/tasks']))
      .catch((err: any) => {
        this.toastService.error(JSON.parse(err._body)[0]);
      });
  }
}
