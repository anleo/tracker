import {Injectable} from "@angular/core";

@Injectable()

export class BusyLoaderService {
  requests = [];

  load(method, key) {
    let reqFound = this.requests.find((req) => req.key === key);

    if (reqFound && reqFound.observable) {

      return reqFound;
    } else {

      let requestItem = {
        key: key,
        method: method()
      };

      this.requests.push(requestItem);
      console.log('this.requests1', this.requests);

      return;
    }
  }

}
