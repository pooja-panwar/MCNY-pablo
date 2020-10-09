import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/providers/user.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  forgotPassForm: FormGroup;
  isSubmitted = false;
  constructor(
    private fb: FormBuilder,
    private user: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.forgotPassForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9][-a-zA-Z0-9._]+@([- a-z0-9]+[.])+[a-z]{2,5}$'
          ),
        ]),
      ],
    });
  }

  //submit form
  submitForm(value) {
    this.isSubmitted = true;
    if (this.forgotPassForm.valid) {
      this.user.forgotPassword(value).subscribe((data) => {
        if (data.status === 'success') {
          const navigationExtras: NavigationExtras = {
            state: {
              email: value.email,
            },
          };
          this.router.navigate(['reset-password'], navigationExtras);
        }
      });
    }
  }

  get errorControl() {
    return this.forgotPassForm.controls;
  }
}
