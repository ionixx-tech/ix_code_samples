import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeService } from './home/home.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgUploaderModule } from 'ngx-uploader';
import {NgxPaginationModule} from 'ngx-pagination';;
import { MyDatePickerModule } from 'mydatepicker';
import { AppService } from '../app.service';
import { MODULE_COMPONENTS, MODULE_ROUTES } from './dashboard.routes';
import {SharedModule} from '../app.sharedmodule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(MODULE_ROUTES),
    NgUploaderModule,
    NgxPaginationModule,
    MyDatePickerModule
  ],
  declarations: [ MODULE_COMPONENTS],
  providers: [
    NgxPaginationModule,
    AppService,
    HomeService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class DashboardModule {}
