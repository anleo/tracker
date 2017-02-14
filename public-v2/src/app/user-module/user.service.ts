import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import 'rxjs/add/observable/of';

import {UserResource} from "./user.resource";
import {User} from "./user";

@Injectable()
export class UserService {
  constructor(private userResource: UserResource) {
    console.log('init user service');
  }

  user: User|undefined;

  get(): Observable<User> {
    if (this.user) {
      return Observable.of(this.user);
    } else {
      return this.userResource.get().$observable;
    }
  }

  set(user: User): void {
    this.user = user;
  }

  unset(): void {
    this.user = undefined;
  }
}
