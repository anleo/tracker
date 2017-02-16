import {Component, ViewContainerRef} from '@angular/core';
import {Router} from "@angular/router";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

import {AuthUser} from "../AuthUser";
import {AuthService} from "../auth.service";


@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  user: AuthUser = new AuthUser();

  constructor(private authService: AuthService,
              private router: Router,
              public toastr: ToastsManager,
              vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  login(): void {
    this.authService
      .login(this.user)
      .then(() => this.router.navigate(['/app/tasks']))
      .catch((err: any) => {
        this.toastr.error(JSON.parse(err._body)[0]);
      });
  }
}
