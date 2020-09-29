import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-signup1',
  templateUrl: './signup1.page.html',
  styleUrls: ['./signup1.page.scss'],
})
export class Signup1Page implements OnInit {
  signUpForm: FormGroup;
  isSubmitted = false;

  constructor(
    public menuCtrl: MenuController,
    private fb: FormBuilder,
    private router: Router
  ) {}

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
      let navigationExtras: NavigationExtras = {
        state: {
          userDetails: this.signUpForm.value,
        },
      };
      this.router.navigate(['signup2'], navigationExtras);
    }
  }

  /**
   * return signup form controls
   */
  get errorControl() {
    return this.signUpForm.controls;
  }
}
