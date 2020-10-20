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

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.initForm();
  }

  ngOnInit() {
    this.preFillFormDetails(this.user);
  }
  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {}

  initForm() {
    this.editProfileForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
      insurance: ['', Validators.required],
      isAvailable: [false],
      timeframes: this.fb.array([]),
      counselingMethod: ['', [Validators.required]],
      cities: new FormControl('', [Validators.required]),
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
    let citiesArr = [];
    let expertiseArr = [];
    this.user.cities.forEach((selectedCity) => {
      citiesArr.push(selectedCity.id);
    });
    this.user.expertises.forEach((selectedExp) => {
      expertiseArr.push(selectedExp.id);
    });
    this.editProfileForm.patchValue(user);
    this.editProfileForm.patchValue({ insurance: this.user.insurance.id });
    this.editProfileForm.get('license').patchValue(this.user.license.id);
    this.editProfileForm.get('expertise').patchValue(expertiseArr);
    this.editProfileForm.get('cities').patchValue(citiesArr);
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
      this.isCitiesValid
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
  //check validation for cities form array
  get isCitiesValid() {
    return this.editProfileForm.get('cities').value.length ? true : false;
  }
  //return form control for checking field erros
  get errorControl() {
    return this.editProfileForm.controls;
  }
}
