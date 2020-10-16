import { Component, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/providers/user.service';
import { constant } from '../../providers/constants/config';

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
    // this.subscription.unsubscribe();
  }

  ionViewDidEnter() {
    // this.subscription = this.platform.backButton.subscribeWithPriority(
    //   9999,
    //   () => {
    //   }
    // );
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
    // this.user.signUpMasterDataSubject.subscribe((data) => {
    //   if (data) {
    //     this.masterData = data.data;
    //   }
    // });
    this.getMasterDataa();
  }

  /**
   * get master data for all the
   * required fields used in signup
   */
  getMasterDataa() {
    this.user.getSignUpMasterData().subscribe((data) => {
      this.masterData = data.data;
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
  pushTimeFrameVal(frame) {
    let val = frame.id;
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
    this.handleTimeFrameChecks(frame, isExistingTimeFrame);
  }

  //delete and add timeframe values in form array accordingly and handle elements
  handleTimeFrameChecks(val, isExistingTimeFrame) {
    if (val.id == constant.TIMEFRAME_ANYTIMEID) {
      if (isExistingTimeFrame < 0) {
        this.masterData.timeframes.forEach((data, index) => {
          if (data.id != 1) {
            data.checked = false;
          }
        });
        for (
          let i = (this.signUpForm.get('timeframes') as FormArray).length;
          i >= 0;
          i--
        ) {
          let time = (this.signUpForm.get('timeframes') as FormArray).value[i];
          if (time != val.id) {
            (this.signUpForm.get('timeframes') as FormArray).removeAt(i);
          }
        }
      }
    } else {
      const anyTimeIndex = this.signUpForm
        .get('timeframes')
        .value.findIndex((timeFrame) => {
          return timeFrame === constant.TIMEFRAME_ANYTIMEID;
        });
      this.masterData.timeframes[0].checked = false;
      if (anyTimeIndex >= 0) {
        (this.signUpForm.get('timeframes') as FormArray).removeAt(anyTimeIndex);
      }
    }
  }

  /**
   * submit signup form and send formdata to backend
   */
  submitSignUp() {
    this.isSubmitted = true;
    console.log(this.signUpForm.value);
    if (this.signUpForm.valid && this.signUpForm.value.timeframes.length) {
      //create form data by merging signup1 and signup2 data
      this.userDetails.phoneNumber = this.userDetails.phoneNumber.toString();
      const userData = { ...this.userDetails, ...this.signUpForm.value };
      this.user.registerUser(userData).subscribe(
        (data) => {
          if (data.status === 'success') {
            this.router.navigate(['registration-success-message']);
          }
        },
        (error) => {}
      );
    }
  }

  get errorControl() {
    return this.signUpForm.controls;
  }

  //stop registration and navgitate back to login
  close() {
    this.router.navigate(['login']);
  }
}
