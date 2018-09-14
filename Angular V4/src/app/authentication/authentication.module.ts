import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MODULE_COMPONENTS, MODULE_ROUTES } from './authentication.routes';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {SharedModule} from '../app.sharedmodule';
import {LoginService} from './login/login.service';





@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(MODULE_ROUTES)
  ],
  declarations: [ MODULE_COMPONENTS ],
  providers: [
    LoginService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AuthenticationModule {}
