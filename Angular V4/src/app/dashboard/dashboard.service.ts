import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppConstants } from '../app.constant';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { AuthGuard } from "../guard/auth.guard";

@Injectable()
export class DashboardService {

  constructor(private http: Http, private authGuard: AuthGuard) {}

  private headers = new Headers(
    {'Content-Type': 'application/json',
      'X-Auth-Token': this.authGuard.getToken()});

  private options = new RequestOptions({ headers: this.headers });

  getDashboard(obj: object): Promise<any> {
    return this.http
      .post(AppConstants.serverUrl + '/dashboard', obj, this.headers)
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

