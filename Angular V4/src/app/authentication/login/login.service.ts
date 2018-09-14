import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams} from '@angular/http';
import { AppConstants } from '../../app.constant';
import { Observable } from 'rxjs/Observable';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthGuard } from '../../guard/auth.guard'
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
@Injectable()

export class LoginService {


  constructor(
    private http: Http,
    private localStorage: CoolLocalStorage,
    private authGuard: AuthGuard
  ) {
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Content-Type', 'application/json' );
    headers.append( 'X-Auth-Token', this.authGuard.getToken());
  }

  // authenticate(obj: object): Promise<any> {
  //   const headers = new Headers();
  //   this.createAuthorizationHeader(headers);
  //   return this.http
  //     .get(AppConstants.serverUrl + '/authenticate?username='+obj['username'], {headers: headers})
  //     .toPromise()
  //     .then(this.extractData)
  //     .catch(this.handleError);
  // }

  authenticate(obj: object): Promise<any> {
    const headers = new Headers();
    return this.http
      .post(AppConstants.serverUrl + '/user', obj)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  logout(): Promise<any> {
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http
      .delete(AppConstants.serverUrl + '/logout', {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  recoverPassword(obj: object): Promise<any> {
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http
      .post(AppConstants.serverUrl + '/authenticate', obj, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  changePassword(obj: object): Promise<any> {
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http
      .post(AppConstants.serverUrl + '/authenticate', obj, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    const body = res.json();
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

}

