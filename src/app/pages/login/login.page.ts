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
import { UserDataService } from 'src/app/providers/user-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isSubmitted: boolean = false;
  deviceToken: string;
  platformName: string;
  constructor(
    public menuCtrl: MenuController,
    private fb: FormBuilder,
    private router: Router,
    private user: UserService,
    private common: CommonService,
    private platform: Platform,
    private userData: UserDataService
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
        Validators.compose([
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
          ),
          ,
          Validators.required,
        ])
      ),
      rememberMe: [false],
    });
  }

  ngOnInit() {
    
    this.checkDevicePlatform();
  }

  ionViewWillEnter() {
    
    this.menuCtrl.enable(false);
  }

  get errorControl() {
    return this.loginForm.controls;
  }

  checkDevicePlatform() {
    if (this.platform.is('android')) {
      this.platformName = 'android';
    } else if (this.platform.is('ios')) {
      this.platformName = 'ios';
    } else {
      this.platformName = 'windows';
    }
  }

  /**
   * @param value : values from login form
   * function is used to login
   */
  submitLogin(value) {
    this.isSubmitted = true;
    this.common.getFromLocal('device_token').then((val) => {
      this.deviceToken = val;
    
    if (this.loginForm.valid) {
      //create form body parameters
      const param = {
        email: value.email,
        password: value.password,
        deviceToken: this.deviceToken,
        deviceType: this.platformName,
      };
      this.user.loginUser(param).subscribe((data) => {
        if (data.status === 'success') {
          this.common
            .saveLocal('userData', JSON.stringify(data.data))
            .then((res) => {
              // this.common.emitUserSubject(data.data);
              this.userData.setUserData().then(() => {
                //check if user has checked true to remember me
                if (value.rememberMe) {
                  this.saveUserToLocal('rememberMe', 'true');
                } else {
                  this.saveUserToLocal('rememberMe', 'false');
                }
                this.router.navigate(['profile']);
              });
            });
        }
      });
    }
    });
  }

  /**
   * save user details to local storage
   * @param data user details received from backend
   */
  saveUserToLocal(key, data) {
    this.common.saveLocal(key, data);
  }
}
