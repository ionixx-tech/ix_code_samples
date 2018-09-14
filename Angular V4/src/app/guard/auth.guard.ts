import { Injectable } from '@angular/core';
import { CoolLocalStorage } from "angular2-cool-storage";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private localStorage: CoolLocalStorage) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('XEHAR_SESSION_INFO')) {
      var session = this.localStorage.getObject('XEHAR_SESSION_INFO');
      if(session['auth_token']){
        return true;
      }
      return false;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['login']);
    return false;
  }

  public getToken(){
    if (localStorage.getItem('XEHAR_SESSION_INFO')) {
      var session = this.localStorage.getObject('XEHAR_SESSION_INFO');
      if(session['auth_token']){
        return session['auth_token'];
      }
      else{
        // not logged in so redirect to login page with the return url
        this.router.navigate(['login']);
        return false;
      }

    }
    this.router.navigate(['login']);
    return false;
  }

  public getUsername(){
    if (localStorage.getItem('XEHAR_SESSION_INFO')) {
      var session = this.localStorage.getObject('XEHAR_SESSION_INFO');
      if(session['username']){
        return session['username'];
      }
      else{
        // not logged in so redirect to login page with the return url
        this.router.navigate(['login']);
        return false;
      }

    }
    this.router.navigate(['login']);
    return false;
  }
}
