import {Injectable} from "@angular/core";
import {Observable, BehaviorSubject} from "rxjs";
import 'rxjs/add/observable/of';
import {UserResource} from "./user.resource";
import {User} from "../models/user";
import {Password} from "../models/password";

@Injectable()
export class UserService {
  user: User|null = null;
  user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(private userResource: UserResource) {
    this.user$.subscribe((user) => this.user = user);
  }

  get(): Observable<User> {
    if (this.user) {
      return Observable.of(this.user);
    } else {
      return this.userResource.get().$observable
        .map((user) => {
          this.set(user);
          return user;
        });
    }
  }

  set(user: User) {
    this.user$.next(user);
    return Observable.of(this.user);
  }

  save(user: User): Observable<User> {
    return this.userResource.save(user).$observable.map((user) => {
      this.set(user);
      return user;
    });
  }

  editPassword(password: Password): Observable<any> {
    return this.userResource.editPassword(password).$observable;
  }

  getUsers(): Observable <User[]> {
    return this.userResource
      .getUsers()
      .$observable;
  }
}
