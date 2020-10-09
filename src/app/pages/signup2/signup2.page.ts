import { Component, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/providers/user.service';

@Component({
  selector: 'app-signup2',
  templateUrl: './signup2.page.html',
  styleUrls: ['./signup2.page.scss'],
})
export class Signup2Page implements OnInit {
  signUpForm: FormGroup;
  isSubmitted = false;
  userDetails;
  masterData;
  timeFrames = [];
  subscription: any;
  constructor(
    public menuCtrl: MenuController,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private platform: Platform,
    private user: UserService
  ) {
    //get tour id from routes state data
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.userDetails = this.router.getCurrentNavigation().extras.state.userDetails;
      }
    });
  }

  ngOnInit() {
    this.initForm();
    this.subscribeToMasterData();
    // this.disableBackNav();
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
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

  /**
   * get master data for all the
   * required fields used in signup
   */
  getMasterData() {
    this.user.getSignUpMasterData().subscribe((data) => {
      this.user.emitMasterData(data);
    });
  }

  //subscirbe to signup required master data
  subscribeToMasterData() {
    this.user.signUpMasterDataSubject.subscribe((data) => {
      if (data) {
        this.masterData = data.data;
      }
    });
  }

  /**
   * disable user to navigate back to signup page 1
   */
  disableBackNav() {
    this.subscription = this.platform.backButton.subscribeWithPriority(
      9999,
      () => {}
    );
  }

  /**
   * initialize signup form fields
   */
  initForm() {
    this.signUpForm = this.fb.group({
      expertise: ['', [Validators.required]],
      isAvailable: [false],
      timeframes: this.fb.array([]),
      cities: ['', [Validators.required]],
      counselingMethod: ['', [Validators.required]],
    });
  }

  /**
   * push time frame checkbox value into form array
   * @param val current timeframe checkbox selected by the user
   */
  pushTimeFrameVal(val) {
    const isExistingTimeFrame = this.signUpForm
      .get('timeframes')
      .value.findIndex((timeFrame) => {
        return timeFrame === val;
      });
    if (isExistingTimeFrame < 0) {
      (this.signUpForm.get('timeframes') as FormArray).push(
        this.fb.control(val)
      );
    } else {
      (this.signUpForm.get('timeframes') as FormArray).removeAt(
        isExistingTimeFrame
      );
    }
  }

  /**
   * submit signup form and send formdata to backend
   */
  submitSignUp() {
    this.isSubmitted = true;
    if (this.signUpForm.valid) {
      //create form data by merging signup1 and signup2 data
      this.userDetails.phoneNumber = this.userDetails.phoneNumber.toString();
      const userData = { ...this.userDetails, ...this.signUpForm.value };
      this.user.registerUser(userData).subscribe((data) => {
        if (data.status === 'success') {
          this.router.navigate(['registration-success-message']);
        }
      });
    }
  }

  get errorControl() {
    return this.signUpForm.controls;
  }
}
