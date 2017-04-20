import {Component} from '@angular/core';
import {Router} from "@angular/router";

import {AuthService} from "../auth.service";
import {AuthUser} from "../AuthUser";
import {User} from "../../user/models/user";
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'app-registration',
  templateUrl: 'registration.component.html'
})
export class RegistrationComponent {
  user: AuthUser = new AuthUser();

  constructor(private authService: AuthService,
              private router: Router,
              public toastService: ToastService) {
  }

  register(): void {
    this.authService
      .register(this.user)
      .then((user: User) => this.router.navigate(['/app/tasks']))
      .catch((err: any) => {
        this.toastService.error(err._body);
      })
  }

}
