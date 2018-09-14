import { Routes } from '@angular/router';
import {AuthenticationComponent} from './authentication.component';
import { LoginComponent } from './login/login.component';

export const MODULE_ROUTES: Routes = [
    { path: '', component: LoginComponent },
]

export const MODULE_COMPONENTS = [
  AuthenticationComponent,
  LoginComponent,
]
