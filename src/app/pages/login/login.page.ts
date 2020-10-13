import { Component, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/providers/user.service';
import { CommonService } from 'src/app/providers/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isSubmitted: boolean = false;

  constructor(
    public menuCtrl: MenuController,
    private fb: FormBuilder,
    private router: Router,
    private user: UserService,
    private common: CommonService,
    private platform: Platform
  ) {
    this.loginForm = this.fb.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9][-a-zA-Z0-9._]+@([- a-z0-9]+[.])+[a-z]{2,5}$'
          ),
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([Validators.minLength(6), Validators.required])
      ),
      rememberMe: [false],
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  get errorControl() {
    return this.loginForm.controls;
  }

  /**
   * @param value : values from login form
   * function is used to login
   */
  submitLogin(value) {
    this.isSubmitted = true;
    if (this.loginForm.valid) {
      //ajax hit for login authentication
      
      this.common.getFromLocal('device_token').then((val) => { //check remember me and navigate to dashboard without login
        if (val) {
          console.log('token>>>>>>>',val);
          const param = {
            email: value.email,
            password: value.password,
            deviceToken: val,
            deviceType: 'ios'
          };
          this.user.loginUser(param).subscribe((data) => {
            if (data.status === 'success') {
              this.saveUserToLocal('userData', data.data);
              //check if user has checked true to remember me
              if (value.rememberMe) {
                this.saveUserToLocal('rememberMe', 'true');
              } else {
                this.saveUserToLocal('rememberMe', 'false');
              }
              // this.common.emitUserSubject(data.data);
              this.router.navigate(['profile']);
            }
          });
        }
      })
      
    }
  }

  /**
   * save user details to local storage
   * @param data user details received from backend
   */
  saveUserToLocal(key, data) {
    this.common.saveLocal(key, JSON.stringify(data));
  }
}
