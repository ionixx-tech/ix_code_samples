import { Component, OnInit, DoCheck } from '@angular/core';
import {AppComponent} from '../../app.component';
import { CoolLocalStorage } from 'angular2-cool-storage';

import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

declare var $: any;
@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit, DoCheck {
    constructor(location: Location,
                private appComponent: AppComponent,
                private localStorage: CoolLocalStorage) {
      this.location = location;
    }
  public query = '';
  public countries = [ 'Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus',
    'Belgium', 'Bosnia & Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus',
    'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Georgia',
    'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kosovo',
    'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Malta',
    'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'Norway', 'Poland',
    'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia',
    'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine', 'United Kingdom', 'Vatican City'];
  public filteredList = [];
    collapseClicked = false;
    private listTitles: any[];
    hideProperties = true;
    userName;
    location: Location;
    loggedUserName = this.localStorage.getItem('user_name');

  ngOnInit() {
	
  }
  logout() {
    this.appComponent.logout();
  }
  ngDoCheck() {
   if (this.appComponent.showNavbarComponent) {
        this.hideProperties = false;
      }
  }

  filter() {
    /*if (this.query !== '') {
      this.filteredList = this.countries.filter(function(el){
        return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
      }.bind(this));
    }else {
      this.filteredList = [];
    }*/
  }

  select(item) {
    /*this.query = item;
    this.filteredList = [];*/
  }

  toggleClick(e) {
      this.collapseClicked = !this.collapseClicked;
      this.appComponent.collapseClicked = this.collapseClicked;

    /*for hiding and showing the navbar jquery is used*/
      if (window.outerWidth > 1183) {
      if ($('#toggle-btn').hasClass('active')) {
        $('.navbar-header .brand-small').hide();
        $('.navbar-header .brand-big').show();
      } else {
        $('.navbar-header .brand-small').show();
        $('.navbar-header .brand-big').hide();
      }
    }

    if (window.outerWidth < 1183) {
      $('.navbar-header .brand-small').show();
    }
  }

}
