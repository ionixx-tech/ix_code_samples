import { Injectable } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import {Location} from '@angular/common';

@Injectable()

export class Utility {
  constructor
  (
    private localStorage: CoolLocalStorage,
    private location: Location,
  ) {}




  isMobile (number) {
    const regex = /^[0-9\+\(\)\-]{10,13}$/;
    if (number.match(regex)) {
      return true;
    }else {
      return false;
    }
  }

  checkSMWidth()  {
    if (window.innerWidth < 992) {
      return true;
    }
    return false;
  }

  checkAccess(key, permission) {
    const obj = this.localStorage.getObject('activityDetails');
    if (obj && obj[key]) {
      if (obj[key].indexOf(permission) !== -1 ) {
        return true;
      }
      return false;
    }
    return false;
  }

  getRoute() {
    let title = this.location.prepareExternalUrl(this.location.path());
    if (title.charAt(0) === '#') {
      title = title.slice( 2 );
    }
    return title;
  }

  nl2br (str, is_xhtml= false) {
    const breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
  }

  validateText (str: string): boolean {
    /*for validating text*/
    if (str) {
      if (!str.trim() || str.trim() === '') {
        return false;
      }
      return true;
    }
    return false;
  }

  emailValidate(str) {
    /*for validating email*/
    const regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (str.match(regex)) {
      return true;
    }
    return false;
  }

  websiteValidateValidate(str) {
    /*for validating website*/
    const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    if (str.match(regex)) {
      return true;
    }
    return false;
  }

  isOTP (number) {
    const regex = /^[0-9]{6}$/;
    if (number.match(regex)) {
      return true;
    }else {
      return false;
    }
  }
}
