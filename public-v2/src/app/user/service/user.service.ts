import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import 'rxjs/add/observable/of';
import {UserResource} from "./user.resource";
import {User} from "../model/user";
import {Password} from "../model/password";

@Injectable()
export class UserService {
  user: User|null = null;
  user$: Subject<User> = new Subject<User>();

  constructor(private userResource: UserResource) {
    this.user$.subscribe((user) => this.user = user);
  }

  get(): Observable<User> {
    if (this.user) {
      return Observable.of(this.user);
    } else {
      return this.userResource.get().$observable.map((user) => {
        this.set(user);
        return user;
      });
    }
  }

  set(user: User): void {
    this.user$.next(user);
  }

  save(user: User): Observable<User> {
    return this.userResource.save(user).$observable;
  }

  editPassword(password: Password): Observable<any> {
    return this.userResource.editPassword(password).$observable;
  }
}
