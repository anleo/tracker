import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {AuthService} from "../auth.service";
import {ToastService} from "../../services/toast.service";

@Component({
  template: ``
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService,
              private router: Router,
              public toastService: ToastService) {
  }

  ngOnInit(): void {
    this.authService.logout()
      .then(() => this.router.navigate(['/app/login']))
      .catch((err: any) => this.toastService.error(JSON.parse(err._body)));
  }
}
