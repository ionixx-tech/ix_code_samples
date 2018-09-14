import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from './login.service';
import {AppConstants , ErrorConstants} from '../../app.constant';
import {AppComponent} from '../../app.component';
import { CoolLocalStorage } from 'angular2-cool-storage';
import {Utility} from '../../app.utility';

declare var $: any;
export class Credential {
  username: string;
  password: string;
}

@Component({
  selector: 'login-cmp',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credential = {
    username: '',
    password: '',
  };
  errMessage = '';
  constructor(
    private router: Router,
    private utility: Utility,
    private loginService: LoginService,
    private appComponent: AppComponent,
    private localStorage: CoolLocalStorage,
  ) { }

  ngOnInit() {
  }

  login() {
    // const self= this
    if (!this.utility.validateText(this.credential.username)) {
      this.errMessage = ErrorConstants.emailError;
      // this.appComponent.addToast('error', 'Error', ErrorConstants.userNameError);
    } else if (!this.utility.validateText(this.credential.password)) {
      this.errMessage = ErrorConstants.passwordError;
      // this.appComponent.addToast('error', 'Error', ErrorConstants.passwordError);
    } else {
      this.errMessage = '';
      let errs = '';
      this.loginService.authenticate(this.credential)
        .then((response) => {

          if(response.auth_token && response.username){
            this.localStorage.setObject('XEHAR_SESSION_INFO',response);
            this.appComponent.showIncludes = true;
            this.router.navigate(['/home']);
          }
          else{
            this.errMessage = ErrorConstants.invalidUser
          }



        })
        .catch((error) => {
          console.log(error);
        });

      this.loginService.authenticate(this.credential)
        .then(
          (response) =>{
            if(response.username){
              this.router.navigate(['/estimate']);
              this.localStorage.setObject('SESSION_INFO', response);
            }
            else{
              this.errMessage = ErrorConstants.invalidUser
            }
          }).catch((error)=>{
            this.errMessage = ErrorConstants.serverError;

      });
    }
  }

}
