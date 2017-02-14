import {Component} from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'password-reset',
  templateUrl: './password-reset.component.html'
})
export class PasswordResetComponent {
  email: string = null;

  constructor(private authService: AuthService) {
  }

  reset(): void {
    this.authService
      .resetPassword(this.email)
      .then(() => console.log('email was sent'))
      .catch((err) => console.log(err));
  }
}
