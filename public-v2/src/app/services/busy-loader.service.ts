import {Injectable} from "@angular/core";
import 'rxjs/add/operator/toPromise';

@Injectable()

export class BusyLoaderService {
  requests = [];

  load(method, key) {
    let reqFound = this.requests.find((req) => req.key === key);

    if (reqFound) {
      return;
    } else {
      let requestItem = {
        key: key,
        method: method
      };

      this.requests.push(requestItem);

      method()
        .subscribe(() => {
          this.requests = this.requests.filter((request) => request.key !== key);
        });
    }
  }
}
