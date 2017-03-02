import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {User} from "./user/models/user";
import {UserService} from "./user/services/user.service";
import {BrowserTitleService} from './services/browser-title/browser-title.service';

@Component({
  selector: 'app',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  user: User;

  constructor(private router: Router,
              private browserTitleService: BrowserTitleService,
              private userService: UserService) {
  };

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      this.browserTitleService.getTitleByUrl(event.url);
    });

    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
  }
}
