import {Component, DoCheck, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {ActivatedRoute, Params, Router, NavigationStart} from '@angular/router';
import {AppConstants, ErrorConstants} from './app.constant';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Utility } from './app.utility';
import { LoginService } from './authentication/login/login.service';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,DoCheck {
  busy: Promise<any>;
  collapseClicked = false;
  showIncludes = false; /*for hiding the top-navbar and side-navbar*/
  showNavbarComponent = false;
  invitationToken;
  constructor
  (
    private http: Http,
    private router: Router, /*for navigating from component to another route*/
    private utility: Utility, /*for accessing utility methods*/
    private localStorage: CoolLocalStorage, /*for accessing local storage*/
    private toastyConfig: ToastyConfig, /*for toast configuration*/
    private toastyService: ToastyService,
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute

  ) {
    this.toastyConfig.theme = 'bootstrap'; /*for toast theme*/
    this.toastyConfig.position = 'top-center'; /*for toast position*/
    /*this.router.events.subscribe(event => {

      if(event instanceof NavigationStart) {
        this.toastyService.clearAll();
      }
    });*/
  }

  ngOnInit() {
    this.showIncludes = false;
  }

  ngDoCheck() {
    // ------------------------------------------------------- //
    // Search Box
    // ------------------------------------------------------ //
    $('#search').on('click', function (e) {
      e.preventDefault();
      $('.search-box').fadeIn();
    });
    $('.dismiss').on('click', function () {
      $('.search-box').fadeOut();
    });
    $('nav.side-navbar ul li').on('click', function (e) {
      e.preventDefault();
      $(this).toggleClass("active");
    });
    $('#drop-btn').on('click', function (e) {
      e.preventDefault();
      $("#drop-data").toggleClass("enable");
    });
    $('#drop-btn_equip').on('click', function (e) {
      e.preventDefault();
      $("#drop-data_equip").toggleClass("enable");
    });
    $('#drop-btn_yard').on('click', function (e) {
      e.preventDefault();
      $("#drop-data_yard").toggleClass("enable");
    });
    $('#drop-btn_uom').on('click', function (e) {
      e.preventDefault();
      $("#drop-data_uom").toggleClass("enable");
    });
    $('#drop-btn_measure').on('click', function (e) {
      e.preventDefault();
      $("#drop-data_measure").toggleClass("enable");
    });
    $('#drop-btn_damage').on('click', function (e) {
      e.preventDefault();
      $("#drop-data_damage").toggleClass("enable");
    });
    $('#drop-btn_bill').on('click', function (e) {
      e.preventDefault();
      $("#drop-data_bill").toggleClass("enable");
    });
    $('#drop-btn_tar').on('click', function (e) {
      e.preventDefault();
      $("#drop-data_tar").toggleClass("enable");
    });
    $('#drop-btn_loc').on('click', function (e) {
      e.preventDefault();
      $("#drop-data_loc").toggleClass("enable");
    });

    $('#drop-btn_res').on('click', function (e) {
      e.preventDefault();
      $("#drop-data_res").toggleClass("enable");
    });
    $("#pendi").click(function(){
    $(".sd_list").hide();
    $(".pd_list").show();
});
$("#subm").click(function(){
$(".pd_list").hide();
$(".sd_list").show();
});


    // ------------------------------------------------------- //
    // Adding fade effect to dropdowns
    // ------------------------------------------------------ //
    $('.dropdown').on('show.bs.dropdown', function () {
      $(this).find('.dropdown-menu').first().stop(true, true).fadeIn();
    });
    $('.dropdown').on('hide.bs.dropdown', function () {
      $(this).find('.dropdown-menu').first().stop(true, true).fadeOut();
    });

    $('.input-material,.mdl-selectfield').focus(function () {
      $(this).parent().removeClass('has-error');
    });
    // ------------------------------------------------------- //


    // ------------------------------------------------------- //


    // ------------------------------------------------------- //
    // Transition Placeholders
    // ------------------------------------------------------ //
    $('input.input-material,.mdl-selectfield').on('focus', function () {
      $(this).siblings('.label-material').addClass('active');
    });

    $('input.input-material,.mdl-selectfield').on('blur', function () {
      $(this).siblings('.label-material').removeClass('active');

      if ($(this).val() !== '') {
        $(this).siblings('.label-material').addClass('active');
      } else {
        $(this).siblings('.label-material').removeClass('active');
      }
    });



    this.activatedRoute.params.subscribe((params: Params) => {
      this.invitationToken = params['invitationToken'];
    });

    /*this will check the current route and include or  remove the side-navbar and top-navbar automatically */
   const route = this.utility.getRoute();
   if (route === AppConstants.urlRoute.loginRoute
      || route.startsWith(AppConstants.urlRoute.changePasswordRoute)
      || route === AppConstants.urlRoute.forgotPasswordRoute
      || route === AppConstants.urlRoute.errorRoute
      || route === AppConstants.urlRoute.registerRoute) {

        this.showIncludes = false;
    } else if (route.startsWith(AppConstants.urlRoute.candidateRoute)
        || route === AppConstants.urlRoute.otpRoute
        || route === AppConstants.urlRoute.securityRoute
        || route === AppConstants.urlRoute.bankAuthentication
        || route.startsWith(AppConstants.urlRoute.completeRoute)) {

        this.showNavbarComponent = true;
        this.showIncludes = false;
    } else {
        this.showIncludes = true;
    }
  }

  addToast(type = null, title = null, message = null) {
    /*this will prompt the message depending on its type whether with the theme and position in constructor*/

    this.toastyService.clearAll();
    const toastOptions: ToastOptions = {
      title: title ? '' : '',
      msg: message ? message : '',
      showClose: true,
      timeout: 10000,
      onAdd: (toast: ToastData) => {
      },
      onRemove: function(toast: ToastData) {

      }
    };
    type = type ? type : '';
    switch (type) {
      case 'default': this.toastyService.default(toastOptions); break;
      case 'info': this.toastyService.info(toastOptions); break;
      case 'success': this.toastyService.success(toastOptions); break;
      case 'wait': this.toastyService.wait(toastOptions); break;
      case 'error': this.toastyService.error(toastOptions); break;
      case 'warning': this.toastyService.warning(toastOptions); break;
    }
  }

  logout() {
    console.log('Logging out...');
    this.localStorage.clear();
    this.router.navigate(['/login']);
  }


}
