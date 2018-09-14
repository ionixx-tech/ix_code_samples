import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams} from '@angular/http';
import { AppConstants } from './app.constant';
import { Observable } from 'rxjs/Observable';
import { CoolLocalStorage } from 'angular2-cool-storage';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
@Injectable()

export class AppService {

  public data: any;

  constructor(
    private http: Http,
    private localStorage: CoolLocalStorage
  ) {
  }
  settter(data: any) {
    this.data = data;
  }

  getter() {
    return this.data;
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Content-Type', 'application/json' );
    headers.append('x-user-token', this.localStorage.getItem('token'));
  }

  verify(id: object): Promise<any> {
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http
      .put(AppConstants.serverUrl + '/email/verify', id, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
  resendEmail(reg: object): Promise<any> {
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http
      .put(AppConstants.serverUrl + '/resendMail', reg, {headers: headers})
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
