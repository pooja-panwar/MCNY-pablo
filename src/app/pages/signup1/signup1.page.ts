import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { MustMatch } from 'src/app/providers/_helpers/must-match.validator';
import { UserService } from 'src/app/providers/user.service';

@Component({
  selector: 'app-signup1',
  templateUrl: './signup1.page.html',
  styleUrls: ['./signup1.page.scss'],
})
export class Signup1Page implements OnInit {
  signUpForm: FormGroup;
  isSubmitted = false;
  masterData;
  constructor(
    public menuCtrl: MenuController,
    private fb: FormBuilder,
    private router: Router,
    private user: UserService
  ) {}

  ngOnInit() {
    this.initForm();
    this.getMasterData();
    this.subscribeToMasterData();
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  /**
   * initialize signup form
   */
  initForm() {
    this.signUpForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        license: ['', [Validators.required]],
        phoneNumber: [
          '',
          Validators.compose([Validators.required, Validators.minLength(10)]),
        ],
        insurance: [null, [Validators.required]],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^[a-zA-Z0-9][-a-zA-Z0-9._]+@([- a-z0-9]+[.])+[a-z]{2,5}$'
            ),
          ],
        ],
        gender: [null, [Validators.required]],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(
              '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
            ),
          ]),
        ],
        confirmPassword: ['', Validators.compose([Validators.required])],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }

  /**
   * when user clicks next to submit signup form 1
   */
  submitSignUp() {
    this.isSubmitted = true;
    if (this.signUpForm.valid) {
      delete this.signUpForm.value.confirmPassword;
      const navigationExtras: NavigationExtras = {
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

  /**
   * get master data for all the
   * required fields used in signup
   */
  getMasterData() {
    this.user.getSignUpMasterData().subscribe((data) => {
      this.user.emitMasterData(data);
    });
  }

  /**
   * subscribe to signup master data for fields
   */
  subscribeToMasterData() {
    this.user.signUpMasterDataSubject.subscribe((data) => {
      if (data && data.status === 'success') {
        this.masterData = data.data;
      }
    });
  }

  //stop registration and navgitate back to login
  close() {
    this.router.navigate(['login']);
  }
}
