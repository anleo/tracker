import {Component} from '@angular/core';
import {AuthService} from "../auth.service";
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'password-reset',
  templateUrl: './password-reset.component.html'
})
export class PasswordResetComponent {
  email: string = null;

  constructor(private authService: AuthService,
              public toastService: ToastService) {
  }

  reset(): void {
    this.authService
      .resetPassword(this.email)
      .then((res: any) => this.toastService.success('Request was sent'))
      .catch((err: any) => {
        this.toastService.error('Check your e-mail or login');
      });
  }
}
