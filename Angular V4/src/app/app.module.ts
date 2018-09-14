import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardModule } from './dashboard/dashboard.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { Http, HttpModule, RequestOptions, XHRBackend  } from '@angular/http';
import { routes } from './app.router';
import {AppService} from './app.service';
import { SharedModule } from './app.sharedmodule';
import { AppComponent } from './app.component';
import { CoolStorageModule } from 'angular2-cool-storage';
import {ToastyModule} from 'ng2-toasty';
import {LoginService} from './authentication/login/login.service';
import {ReactiveFormsModule} from '@angular/forms';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BusyModule} from 'angular2-busy';


import {Utility} from './app.utility';

import {HttpService} from './app-http.service';
export function httpFactory(backend: XHRBackend, options: RequestOptions){
  return new HttpService(backend, options);
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    DashboardModule,
    SidebarModule,
    NavbarModule,
    CoolStorageModule,
    HttpModule,
    FormsModule,
    BrowserAnimationsModule,
    BusyModule,
    ToastyModule.forRoot(),
    routes,
    SharedModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [
    AppService,
    Utility,
    LoginService,
    { provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions]
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
