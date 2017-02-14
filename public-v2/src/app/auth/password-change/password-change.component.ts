import {Component} from '@angular/core';
import {AuthService} from "../auth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'password-change',
  templateUrl: './password-change.component.html'
})
export class PasswordChangeComponent {
  newPassword: string = null;
  newPasswordConfirm: string = null;

  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  change(): void {
    if (this.newPassword === this.newPasswordConfirm && this.route.params['token']) {
      this.authService
        .changePassword(this.newPassword, this.route.params['token'])
        .then(() => this.router.navigate(['/app/tasks']))
        .catch((err: any) => {
          console.log(err);
        })
    } else {
      console.log('something went wrong during change password')
    }
  }
}
