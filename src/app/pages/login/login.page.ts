import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular'; 
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';

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
    private navCtrl: NavController,
  ) { 
    this.loginForm = this.fb.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required,
      ]))
    });
  }

  ngOnInit() {
  }
  ionViewWillEnter() {
      this.menuCtrl.enable(false);
  }

  /**
   * 
   * @param value : values from login form
   * function is used to login 
   */
  submitLogin(value) {
    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
      //ajax hit for login authentication
      let param = { email: value.email, password: value.password }
      // this.callHttp.postHttp(APIList.LOGIN, param).subscribe(res => {
      //   console.log(res);
      //   if (res.status) {
      //     //save remember me flag
      //     if (value.rememberMe) {
      //       this.common.saveLocal('rememberMe', 'true');
      //     } else {
      //       this.common.saveLocal('rememberMe', 'false');
      //     }
      //     //concat base url to image
      //     res.data.profile_image = IMG_URL + res.data.profile_image;
      //     this.currUser.userData = new User(
      //       res.data.id,
      //       res.data.address,
      //       res.data.name,
      //       res.data.mobile_number,
      //       res.data.profile_image,
      //       res.data.email,
      //       res.data.api_token
      //     );
      //     this.common.saveLocal('loginType', 'auth');
      //     this.common.saveLocal('userData', JSON.stringify(this.currUser.userData));
      //     this.navCtrl.navigateRoot('home/auth');
      //   }
      // })
    }
  }

}
