import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../app.component';
declare var $: any;

@Component({
    selector: 'authentication-cmp',
    moduleId: module.id,
    templateUrl: 'authentication.component.html'
})

export class AuthenticationComponent implements OnInit{
  constructor(private appComponent: AppComponent ) {
  }
  ngOnInit() {
    this.appComponent.showIncludes = false;
  }
}
