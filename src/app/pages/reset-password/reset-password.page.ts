import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch } from 'src/app/providers/_helpers/must-match.validator';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  resetPassForm: FormGroup;
  email;
  isSubmitted = false;
  subscription: any;
  constructor(
    private fb: FormBuilder,
    private user: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private platform: Platform
  ) {
    //get tour id from routes state data
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.email = this.router.getCurrentNavigation().extras.state.email;
      }
    });
  }

  ngOnInit() {
    this.initForm();
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(
      9999,
      () => {
        // do nothing
      }
    );
  }

  //initialize reset password form
  initForm() {
    this.resetPassForm = this.fb.group(
      {
        otp: ['', [Validators.required]],
        password: [
          '',
          Validators.compose([Validators.minLength(6), Validators.required]),
        ],
        confirmPassword: ['', Validators.compose([Validators.required])],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }

  /**
   * submit reset password form
   * @param value form values
   */
  submitForm(value) {
    this.isSubmitted = true;
    if (this.resetPassForm.valid) {
      delete value.confirmPassword;
      value.email = this.email;
      this.user.resetPassword(value).subscribe((data) => {
        this.resetPassForm.reset();
      });
    }
  }

  get errorControl() {
    return this.resetPassForm.controls;
  }
}
