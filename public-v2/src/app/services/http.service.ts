import {Injectable} from "@angular/core";
import {Http, ConnectionBackend, RequestOptions, Response, Request} from "@angular/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";

@Injectable()

export class HttpService extends Http {
  constructor(backend: ConnectionBackend,
              requestOptions: RequestOptions,
              private router: Router) {
    super(backend, requestOptions)
  }

  request(url: string| Request, options?: RequestOptions): Observable<Response> {
    return super.request(url, options)
      .catch((err: any) => {
        if (err.status === 401) {
          this.router.navigate(['/app/login']);
        }

        return Observable.throw(err);
      })
  }
}
