import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

import {User} from "./User";

@Injectable()
export class UserService {
  user: User|null = null;
  user$: Subject<User> = new Subject<User>();

  constructor() {
    this.user$.subscribe((user) => this.user = user);
  }

  setUser(user: User): Observable<User> {
    this.user$.next(user);
    return Observable.of(user);
  }
}
