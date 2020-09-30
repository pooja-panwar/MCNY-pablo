import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signup2',
  templateUrl: './signup2.page.html',
  styleUrls: ['./signup2.page.scss'],
})
export class Signup2Page implements OnInit, OnDestroy {
  signUpForm: FormGroup;
  isSubmitted = false;
  userDetails;
  timeFrames = [
    'Anytime',
    'Afternoon',
    'Weekends',
    'Morning',
    'Evening',
    'Others',
  ];
  expertiseArr = [
    { id: 1, name: 'Expertise 1' },
    { id: 2, name: 'Expertise 2' },
  ];
  cities = [
    { id: 1, name: 'City of Lockport' },
    { id: 2, name: 'City of North Tonawanda' },
    { id: 3, name: 'City of Niagara Falls' },
    { id: 4, name: 'Town of Cambria' },
  ];
  subscription: any;
  constructor(
    public menuCtrl: MenuController,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private platform: Platform
  ) {
    //get tour id from routes state data
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.userDetails = this.router.getCurrentNavigation().extras.state.userDetails;
        console.log(this.userDetails);
      }
    });
  }

  ngOnInit() {
    this.initForm();
    // this.disableBackNav();
  }
  ngOnDestroy(): void {
    //destroy event listener for enabling back navigation again
    // document.removeEventListener(
    //   'backbutton',
    //   function (event) {
    //     event.preventDefault();
    //     event.stopPropagation();
    //   },
    //   false
    // );
    this.subscription.unsubscribe();
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
      availability: [false],
      timeFrame: this.fb.array([]),
      cities: ['', [Validators.required]],
      councellingMethod: ['', [Validators.required]],
    });
  }

  /**
   * push time frame checkbox value into form array
   * @param val current timeframe checkbox selected by the user
   */
  pushTimeFrameVal(val) {
    const isExistingTimeFrame = this.signUpForm
      .get('timeFrame')
      .value.findIndex((timeFrame) => {
        return timeFrame === val;
      });
    if (isExistingTimeFrame < 0) {
      (this.signUpForm.get('timeFrame') as FormArray).push(
        this.fb.control(val)
      );
    } else {
      (this.signUpForm.get('timeFrame') as FormArray).removeAt(
        isExistingTimeFrame
      );
    }
  }

  /**
   * submit signup form and send formdata to backend
   */
  submitSignUp() {
    this.isSubmitted = true;
    console.log(this.signUpForm.value);
    if (this.signUpForm.valid) {
      this.router.navigate(['profile']);
    }
  }

  get errorControl() {
    return this.signUpForm.controls;
  }
}
