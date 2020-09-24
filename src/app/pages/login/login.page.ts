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

  get errorControl() {
    return this.loginForm.controls;
  }

  /**
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
      //api hit
    }
  }

}
