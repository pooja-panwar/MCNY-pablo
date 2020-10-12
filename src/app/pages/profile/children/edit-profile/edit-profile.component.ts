import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/providers/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit, OnChanges {
  @Input() user: any;
  masterData: any;
  editProfileForm: FormGroup;
  constructor(private fb: FormBuilder, private userService: UserService) {
    this.initForm();
  }

  ngOnInit() {
    this.getRegisterMasterData();
  }
  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    this.fillForm(this.user);
  }

  initForm() {
    this.editProfileForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
      insurance: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9][-a-zA-Z0-9._]+@([- a-z0-9]+[.])+[a-z]{2,5}$'
          ),
        ],
      ],
      isAvailable: [false],
    });
  }

  /**
   * get master data for all the
   * required fields used in signup
   */
  getRegisterMasterData() {
    this.userService.getSignUpMasterData().subscribe((data) => {
      this.masterData = data;
    });
  }

  fillForm(user) {
    this.editProfileForm.patchValue(user);
  }
}
