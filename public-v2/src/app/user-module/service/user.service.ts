import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import 'rxjs/add/observable/of';
import {UserResource} from "./user.resource";
import {User} from "../model/user";
import {Password} from "../model/password";

@Injectable()
export class UserService {
  user: User|undefined;

  constructor(private userResource: UserResource) {
  }

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

  save(user: User): Observable<User> {
    return this.userResource.save(user).$observable;
  }

  editPassword(password: Password): Observable<any> {
    return this.userResource.editPassword(password).$observable;
  }
}
