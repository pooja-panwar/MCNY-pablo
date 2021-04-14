import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/providers/user.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.page.html',
  styleUrls: ['./email-verification.page.scss'],
})
export class EmailVerificationPage implements OnInit {
  isSubmitted = false;
  emailVefiryForm: FormGroup;
  constructor(private fb: FormBuilder, private user: UserService) {}

  ngOnInit() {
    this.emailVefiryForm = this.fb.group({
      verificationCode: ['', Validators.required],
    });
  }

  submitVerifyForm(value) {
    if (this.emailVefiryForm.valid) {
      this.user.verifyUserEmail(value).subscribe((data) => {});
    }
  }
}
