import { Component, OnInit, DoCheck} from '@angular/core';
import {AppComponent} from '../app.component';
import {Location} from '@angular/common';
import { Utility } from '../app.utility';
import {NavbarComponent} from '../shared/navbar/navbar.component';
import {CoolLocalStorage} from 'angular2-cool-storage';
import { AuthGuard } from '../guard/auth.guard'

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'sidebar-cmp',
  templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit, DoCheck {
  location: Location;
  navCollapseClicked;
  currentUsername = '';
  public menuItems: any[];
  constructor(location: Location,
              private appComponent: AppComponent,
              private utility: Utility,
              private localStorage: CoolLocalStorage,
              private authGuard: AuthGuard

  ) {this.location = location; }

  ngOnInit() {
    this.currentUsername = this.authGuard.getUsername();
  }
  ngDoCheck() {
    this.navCollapseClicked = this.appComponent.collapseClicked;

  }
  activeRoute(route) {
    if (this.utility.getRoute() === route) {
      return true;
    }else {
      return false;
    }

  }
  hasControlIndex(key) {
    if (this.localStorage.getObject('featureDetails')) {
      const data = this.localStorage.getObject('featureDetails');
      if (data) {
        for (const keyB in data) {
          if (data[keyB] === key) {
            return true;
          }
        }
        return false;
      }
    }
    return false;

  }
  checkRoute() {
    let title = this.location.prepareExternalUrl(this.location.path());
    if (title.charAt(0) === '#') {
      title = title.slice( 2 );
    }
    return title;
  }
  logout() {
    this.appComponent.logout();
  }

}
