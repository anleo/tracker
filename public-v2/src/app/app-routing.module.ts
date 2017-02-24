import {NgModule} from '@angular/core';
import {Routes, RouterModule} from "@angular/router";
import {LoginComponent} from "./auth/login/login.component";
import {RegistrationComponent} from "./auth/registration/registration.component";
import {PasswordResetComponent} from "./auth/password-reset/password-reset.component";
import {PasswordChangeComponent} from "./auth/password-change/password-change.component";
import {BlankComponent} from "./blank/blank.component";
import {LogoutComponent} from "./auth/logout/logout.component";
import {UserResolver} from "./user/resolver/UserResolver";
import {ProfileComponent} from "./user/components/user-profile.component";
import {CanActivatePublicGuard} from "./guards/can-activate-public.guard";

const routes: Routes = [
  {
    path: 'app',
    component: BlankComponent,
    children: [
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [CanActivatePublicGuard]
      },
      {
        path: 'logout',
        component: LogoutComponent
      },
      {
        path: 'register',
        component: RegistrationComponent,
        canActivate: [CanActivatePublicGuard]
      },
      {
        path: 'reset-password',
        component: PasswordResetComponent,
        canActivate: [CanActivatePublicGuard]
      },
      {
        path: 'users',
        children: [
          {path: '', redirectTo: 'me', pathMatch: 'full'},
          {
            path: 'me',
            component: ProfileComponent
          }
        ]
      },
      {
        path: 'tasks',
        resolve: {user: UserResolver},
        loadChildren: './tracker/tracker.module#TrackerModule'
      },
      {
        path: '**',
        redirectTo: 'tasks'
      }
    ]
  },
  {
    path: 'public',
    component: BlankComponent,
    children: [
      {
        path: 'change-password/:token',
        component: PasswordChangeComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: 'app/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'app/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
