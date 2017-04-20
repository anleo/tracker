import {Component, OnInit} from "@angular/core";
import 'rxjs/add/operator/catch'
import 'rxjs/Rx';

import {User} from "../models/user";
import {Password} from "../models/password";
import {UserService} from "../services/user.service";
import {ToastService} from "../../services/toast.service";

@Component({
  moduleId: module.id,
  templateUrl: 'user-profile.component.html'
})

export class ProfileComponent implements OnInit {
  user: User = new User();
  password: Password = new Password();
  changePass: boolean = false;

  constructor(private userService: UserService,
              private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.userService.get().subscribe((user) => this.user = user);
  }

  save(): void {
    this.userService
      .save(this.user)
      .subscribe((user) => {
        this.user = user;
        this.toastService.info('', 'Saved');
      }, (err) => {
        this.toastService.error('', JSON.parse(err._body).toString());
      })
  }

  passwordChange(): void {
    let isPasswordChanged = this.password.newPassword !== this.password.oldPassword;
    let arePasswordsEqual = this.password.newPassword === this.password.newPasswordConfirm;

    if (arePasswordsEqual && isPasswordChanged) {
      this.userService
        .editPassword(this.password)
        .subscribe(() => {
          this.toastService.info('', 'Saved');
        }, () => {
          this.toastService.error('', 'Wrong password');
        });
    } else {
      this.toastService.error('', 'Mismatch in new password');
    }
  }
}
