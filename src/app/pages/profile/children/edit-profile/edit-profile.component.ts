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

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit, OnChanges {
  @Input() user: any;
  @Output() userData = new EventEmitter();
  masterData: any;
  editProfileForm: FormGroup;
  constructor(private fb: FormBuilder, private userService: UserService) {
    this.initForm();
  }

  ngOnInit() {
    this.getRegisterMasterData();
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
   * get master data for all the
   * required fields used in signup
   */
  getRegisterMasterData() {
    this.userService.getSignUpMasterData().subscribe((data) => {
      this.masterData = data.data;
      this.fillForm(this.user);

      this.user.timeframes.forEach((userTime) => {
        let selected = this.masterData.timeframes.filter((time) => {
          return time.timeframe === userTime.timeframe;
        });
        selected[0].checked = true;
        this.pushTimeFrameControl(selected[0].id);
      });
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
    console.log(this.editProfileForm.value);
  }

  /**
   * push time frame checkbox value into form array
   * @param val current timeframe checkbox selected by the user
   */
  pushTimeFrameVal(val) {
    console.log(this.editProfileForm.value);
    const isExistingTimeFrame = this.editProfileForm
      .get('timeframes')
      .value.findIndex((timeFrame) => {
        return timeFrame === val;
      });
    if (isExistingTimeFrame < 0) {
      (this.editProfileForm.get('timeframes') as FormArray).push(
        this.fb.control(val)
      );
    } else {
      (this.editProfileForm.get('timeframes') as FormArray).removeAt(
        isExistingTimeFrame
      );
    }
  }

  //emti user data emitter
  save() {
    if (this.editProfileForm.valid) {
      this.userData.emit(this.editProfileForm.value);
    }
  }

  //cancel edit user profile
  cancel() {
    this.userData.emit(false);
  }
}
