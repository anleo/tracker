import {Component, ViewContainerRef, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

import {AuthService} from "../auth.service";

@Component({
  template: ``
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService,
              private router: Router,
              public toastr: ToastsManager,
              vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(): void {
    this.authService.logout()
      .then(() => this.router.navigate(['/app/login']))
      .catch((err: any) => this.toastr.error(JSON.parse(err._body)));
  }
}
