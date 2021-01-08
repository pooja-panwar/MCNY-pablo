import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/providers/user.service';
import { constant } from '../../providers/constants/config';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-signup2',
  templateUrl: './signup2.page.html',
  styleUrls: ['./signup2.page.scss'],
})
export class Signup2Page implements OnInit, OnDestroy {
  signUpForm: FormGroup;
  isSubmitted = false;
  userDetails;
  masterData;
  timeFrames = [];
  subscription: any;
  objectKeys = Object.keys;
  countyDB = [];

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
    console.log('ngOnInit');
    this.initForm();
    this.subscribeToMasterData();
    // this.disableBackNav();
  }
  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    // this.subscription.unsubscribe();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
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
    // this.masterData = [];
    this.user.signUpMasterDataSubject.subscribe((data) => {
      console.log('master data subscribe>>', data);
      if (data) {
        //setTimeout(()=>{
        //this.masterData.timeframes = [];
        this.masterData = data.data;
        this.countyDB = this.masterData.counties;
        //}, 500)
        // setTimeout(()=>{
        //   this.masterData.timeframes = [];
        // }, 2000)
      }
    });
  }

  // getCounty(zip) {
  //   console.log(zip)
  //   if(zip.length >= 5 && zip.length <= 9) {
  //     this.user.getCountyByZip(zip).subscribe(res => {
  //       console.log('res zip>', res);
  //       this.countyDB = res.data;
  //           // console.log(this.countyDB[0].id);
  //         if(this.countyDB[0] && this.countyDB[0].id) {
  //           setTimeout(() =>{
  //             this.signUpForm.get('county').patchValue(this.countyDB[0].id);
  //           },500)
  //         }
  //     }, error=>{
  //       console.log('err1', error)
  //       //if(error.status == 404){
  //         this.countyDB = [];
  //         this.signUpForm.get('county').patchValue('');

  //       //}
  //     })
  //   }
  // }

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
      counties: ['', [Validators.required]],
      counselingMethod: ['', [Validators.required]],
      //zipcode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(9)]],
      //city: ['', [Validators.required]]
    });
    // this.loadCounty();
  }

  // loadCounty() {
  //   this.signUpForm.controls.zipcode.valueChanges
  //   .debounceTime(2000) //reurn ajax hit after 2.5 secs of typing any word
  //   .distinctUntilChanged()
  //   .switchMap( zip => {
  //     if(zip.length >= 5 && zip.length <= 9)
  //       return this.user.getCountyByZip(zip)
  //     return [];
  //   })
  //   .subscribe(resp => {
  //     console.log(resp);
  //     this.countyDB = resp.data;
  //     // console.log(this.countyDB[0].id);
  //     if(this.countyDB[0] && this.countyDB[0].id) {
  //       setTimeout(() =>{
  //         this.signUpForm.get('county').patchValue(this.countyDB[0].id);
  //       },500)
  //     }

  //   });
  // }

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

  ngOnDestroy() {
    console.log('page leave');
    this.masterData.timeframes.forEach((timeframe) => {
      timeframe.checked = false;
    });
  }
}
