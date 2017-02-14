import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {BlankComponent} from './blank/blank.component';
import {UserModule} from "./user-module/user.module";
import {RouterModule} from "@angular/router";
import {HttpModule} from "@angular/http";

@NgModule({
  declarations: [
    AppComponent,
    BlankComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    HttpModule,
    AppRoutingModule,
    UserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
