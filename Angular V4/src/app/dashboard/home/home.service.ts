import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, URLSearchParams, Response } from '@angular/http';
import { AppConstants } from '../../app.constant';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthGuard } from '../../guard/auth.guard'

@Injectable()
export class HomeService {


  constructor(private http: Http, private localStorage: CoolLocalStorage, private authGuard: AuthGuard) { }

  private headers = new Headers(
    {
      'Content-Type': 'application/json',
      'X-Auth-Token': this.authGuard.getToken()
    });

  getPendingEstimates(search = ""): Promise<any> {

    return this.http
      .get( AppConstants.serverUrl + '/pending-estimate?search='+search,{headers:this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
  getSubmittedEstimates(search = ""): Promise<any> {

    return this.http
      .get( AppConstants.serverUrl + '/submitted-estimate?search='+search,{headers:this.headers})
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
