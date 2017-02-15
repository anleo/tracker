import {Component, OnInit} from "@angular/core";
import {User} from "./user";
import {UserService} from "./user.service";

@Component({
  moduleId: module.id,
  templateUrl: './profile.html'
})

export class ProfileComponent implements OnInit {
  user: User;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.get().subscribe((user) => this.user = user);
  }
}
