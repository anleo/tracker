import {Component} from '@angular/core';
import {AuthService} from "../auth.service";
import {Router, ActivatedRoute} from "@angular/router";

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
    let token = this.route.snapshot.params['token'];

    if (this.newPassword === this.newPasswordConfirm && token) {
      this.authService
        .changePassword(this.newPassword, token)
        .then(() => this.router.navigate(['/app/tasks']))
        .catch((err: any) => {
          console.log(err);
        })
    } else {
      console.log('something went wrong during change password')
    }
  }
}
