import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {ResourceModule} from "ng2-resource-rest";
import {ToastModule} from 'ng2-toastr/ng2-toastr';

import {AppComponent} from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {TrackerModule} from "./tracker/tracker.module";
import {AuthModule} from "./auth/auth.module";
import {UserModule} from "./user/user.module";

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
