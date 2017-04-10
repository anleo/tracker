import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {BasketResource} from "../resources/basket.resource";
import {User} from "../../user/models/user";


@Injectable()
export class BasketService {
  constructor(private basketResource: BasketResource) {}

  get(user: User): Observable<any> {
    return this.basketResource.get({userId: user._id}).$observable;
  }

}

