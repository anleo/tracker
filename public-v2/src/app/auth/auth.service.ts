import {Injectable} from '@angular/core';
import {AuthResource} from "./auth.resource";
import {User} from "../user/User";
import {AuthUser} from "./AuthUser";
import {UserService} from "../user/user.service";

@Injectable()
export class AuthService {

  constructor(private authResource: AuthResource,
              private userService: UserService) {
  }

  register(user: AuthUser): Promise<User> {
    return this.authResource
      .register(user)
      .$observable
      .map((user: User) => {
        this.userService.setUser(user);
        return user;
      })
      .toPromise()

  }

  login(user: AuthUser): Promise<User> {
    return this.authResource
      .login(user)
      .$observable
      .map((user: User) => {
        this.userService.setUser(user);
        return user;
      })
      .toPromise();
  }

  logout(): Promise<any> {
    return this.authResource
      .logout()
      .$observable
      .map(() => this.userService.setUser(null))
      .toPromise();
  }

  resetPassword(email: string): Promise<any> {
    return this.authResource
      .resetPassword({email: email})
      .$observable
      .toPromise();
  }

  changePassword(email: string, token: string): Promise<User> {
    return this.authResource
      .changePassword({email: email, token:token})
      .$observable
      .toPromise();
  }

}
