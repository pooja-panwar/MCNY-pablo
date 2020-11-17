import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { UserService } from 'src/app/providers/user.service';
import { constant } from '../../../../providers/constants/config';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit, OnChanges {
  @Input() user: any;
  @Input() masterData: any;
  @Output() userData = new EventEmitter();
  isSubmitted = false;
  isTimeframeOtherVal = false;
  editProfileForm: FormGroup;
  objectKeys = Object.keys;
  countyDB = [];

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.initForm();
  }

  ngOnInit() {
    this.preFillFormDetails(this.user);
    //this.loadCounty();
  }
  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {}

  initForm() {
    this.editProfileForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
      insurances: ['', Validators.required],
      isAvailable: [false],
      timeframes: this.fb.array([]),
      counselingMethod: ['', [Validators.required]],
      counties: ['', [Validators.required]],
      // zipcode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(9)]],
      // city: ['', [Validators.required]],
      expertise: new FormControl('', [Validators.required]),
      license: new FormControl('', [Validators.required]),
    });
  }

  /**
   * fill form for user edit
   * @param user user details for filling form
   */
  preFillFormDetails(user) {
    this.fillForm(user);
    console.log('pre fill>>>>', user)

    this.handleTimeFrameVals();
  }

  handleTimeFrameVals() {
    this.masterData.timeframes.forEach((timeFrame) => {
      timeFrame.checked = false;
    });

    this.user.timeframes.forEach((userTime) => {
      let selected = this.masterData.timeframes.filter((time) => {
        return time.timeframe === userTime.timeframe;
      });
      selected[0].checked = true;
      this.pushTimeFrameControl(selected[0].id);
    });
  }

  /**
   * create form array control for time frames
   * @param timeFrameInput array containing time frame values
   */
  pushTimeFrameControl(timeFrameInput) {
    (this.editProfileForm.get('timeframes') as FormArray).push(
      new FormControl(timeFrameInput)
    );
  }

  /**
   * dill form to let user edit
   * @param user user selected fields data
   */
  fillForm(user) {
    let countiesArr = [];
    let expertiseArr = [];
    let insurances = [];
    let counselingKey = this.objectKeys(user.counselingMethod)[0];
    console.log('counselingKey', counselingKey)
    console.log('user', this.user)
    console.log('masterdata', this.masterData);
    this.user.counties.forEach((selectedCounty) => {
      countiesArr.push(selectedCounty.id);
    });
    this.user.expertises.forEach((selectedExp) => {
      expertiseArr.push(selectedExp.id);
    });
    this.user.insurances.forEach(insurance => {
      insurances.push(insurance.id);
    });
    this.editProfileForm.patchValue(user);
    this.editProfileForm.patchValue({ insurances: insurances });
    this.editProfileForm.get('license').patchValue(this.user.license.id);
    this.editProfileForm.get('expertise').patchValue(expertiseArr);
    this.countyDB = this.masterData.counties;
    setTimeout(()=>{
      //this.editProfileForm.get('county').patchValue(this.user.county.id);
      this.editProfileForm.get('counties').patchValue(countiesArr);
    }, 500)
    this.editProfileForm.get('counselingMethod').patchValue(counselingKey);

  }

  /**
   * push time frame checkbox value into form array
   * @param val current timeframe checkbox selected by the user
   */
  pushTimeFrameVal(val) {
    const isExistingTimeFrame = this.editProfileForm
      .get('timeframes')
      .value.findIndex((timeFrame) => {
        return timeFrame === val.id;
      });
    if (isExistingTimeFrame < 0) {
      (this.editProfileForm.get('timeframes') as FormArray).push(
        this.fb.control(val.id)
      );
    } else {
      (this.editProfileForm.get('timeframes') as FormArray).removeAt(
        isExistingTimeFrame
      );
    }
    this.handleTimeFrameChecks(val, isExistingTimeFrame);
  }

  //delete and add timeframe values in form array accordingly and handle elements
  handleTimeFrameChecks(val, isExistingTimeFrame) {
    if (val.id == 1) {
      if (isExistingTimeFrame < 0) {
        this.masterData.timeframes.forEach((data, index) => {
          //set checked attr of all the timeframes excpt anytime to false
          if (data.id != constant.TIMEFRAME_ANYTIMEID) {
            data.checked = false;
          }
        });
        for (
          let i = (this.editProfileForm.get('timeframes') as FormArray).length;
          i >= 0;
          i--
        ) {
          let time = (this.editProfileForm.get('timeframes') as FormArray)
            .value[i];
          if (time != val.id) {
            (this.editProfileForm.get('timeframes') as FormArray).removeAt(i);
          }
        }
      }
    } else {
      const anyTimeIndex = this.editProfileForm
        .get('timeframes')
        .value.findIndex((timeFrame) => {
          return timeFrame === constant.TIMEFRAME_ANYTIMEID;
        });
      this.masterData.timeframes[0].checked = false;
      if (anyTimeIndex >= 0) {
        (this.editProfileForm.get('timeframes') as FormArray).removeAt(
          anyTimeIndex
        );
      }
    }
  }

  // getCounty(zip) {
  //   console.log(zip)
  //   if(zip.length >= 5 && zip.length <= 9) {
  //     this.userService.getCountyByZip(zip).subscribe(res => {
  //       console.log(res);
  //       this.countyDB = res.data;
  //           // console.log(this.countyDB[0].id);
  //         if(this.countyDB[0] && this.countyDB[0].id) {
  //           setTimeout(() =>{
  //             this.editProfileForm.get('county').patchValue(this.countyDB[0].id);
  //           },500)
  //         }
  //     }, error=>{
  //       console.log('err1', error)
  //       //if(error.status == 404){
  //         this.countyDB = [];
  //         this.editProfileForm.get('county').patchValue('');

  //       //}
  //     })
  //   }
  // }

  //emti user data emitter
  save() {
    this.editProfileForm.value.phoneNumber = `${this.editProfileForm.value.phoneNumber}`;
    this.isSubmitted = true;
    if (this.isEditFormValid()) {
      this.userData.emit(this.editProfileForm.value);
    }
  }

  //cancel edit user profile
  cancel() {
    this.userData.emit(false);
  }
  //check if form is valid or not and return
  isEditFormValid() {
    return (
      this.editProfileForm.valid &&
      this.isTimeFramesValid &&
      this.isExpertisesValid &&
      this.isCountiessValid
    );
  }
  //check validation for timeframe form array
  get isTimeFramesValid() {
    return this.editProfileForm.get('timeframes').value.length ? true : false;
  }
  //check validation for expertise form array
  get isExpertisesValid() {
    return this.editProfileForm.get('expertise').value.length ? true : false;
  }
  //check validation for counties form array
  get isCountiessValid() {
    return this.editProfileForm.get('counties').value.length ? true : false;
  }
  //return form control for checking field erros
  get errorControl() {
    return this.editProfileForm.controls;
  }
}
