import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup1',
  templateUrl: './signup1.page.html',
  styleUrls: ['./signup1.page.scss'],
})
export class Signup1Page implements OnInit {
  signUpForm: FormGroup;
  isSubmitted = false;

  constructor(public menuCtrl: MenuController, private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  /**
   * initialize signup form
   */
  initForm() {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      license: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      insurance: [null, [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ],
      ],
      gender: [null, [Validators.required]],
    });
  }

  /**
   * when user clicks next to submit signup form 1
   */
  submitSignUp() {
    console.log(this.signUpForm.value);
    this.isSubmitted = true;
    if (this.signUpForm.valid) {
    }
  }

  /**
   * return signup form controls
   */
  get errorControl() {
    return this.signUpForm.controls;
  }
}
