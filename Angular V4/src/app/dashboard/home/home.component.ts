import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import { AppConstants } from '../../app.constant';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Utility } from '../../app.utility';
import { AppService } from '../../app.service';
import { AppComponent } from '../../app.component';
import { HomeService } from './home.service'

@Component({
  selector: 'app-candidate',
  templateUrl: './home.component.html?v=${new Date().getTime()}',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  constructor(private appComponent : AppComponent,
){

              }

  ngOnInit() {

  }


}
