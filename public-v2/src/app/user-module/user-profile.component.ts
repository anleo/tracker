import {Component, OnInit} from "@angular/core";
import {User} from "./user";
import {UserService} from "./user.service";

@Component({
  template: '<h3>{{user}}</h3>'
})

export class ProfileComponent implements OnInit {
  user: User;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.get().subscribe((user) => this.user = user);
  }
}
