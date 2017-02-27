import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule, Http, XHRBackend, RequestOptions} from '@angular/http';
import {Router} from "@angular/router";
import {ResourceModule} from "ng2-resource-rest";
import {ToastModule} from 'ng2-toastr/ng2-toastr';

import {AppComponent} from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {TrackerModule} from "./tracker/tracker.module";
import {AuthModule} from "./auth/auth.module";
import {UserModule} from "./user/user.module";
import {HttpService} from "./services/http.service";
import {CanActivatePublicGuard} from "./guards/can-activate-public.guard";

export function httpUseFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions, router: Router) {
  return new HttpService(xhrBackend, requestOptions, router);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ResourceModule.forRoot(),
    ToastModule.forRoot(),
    AppRoutingModule,
    TrackerModule,
    AuthModule,
    UserModule
  ],
  providers: [
    {
      provide: Http,
      useFactory: httpUseFactory,
      deps: [XHRBackend, RequestOptions, Router]
    },
    HttpService,
    CanActivatePublicGuard
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
