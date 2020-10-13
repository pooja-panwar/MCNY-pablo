import { Component, OnInit, Input, OnChanges } from '@angular/core';
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
      timeFrames: this.fb.array([]),
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
          return time.timeframe === userTime;
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
    (this.editProfileForm.get('timeFrames') as FormArray).push(
      new FormControl(timeFrameInput)
    );
  }

  /**
   * dill form to let user edit
   * @param user user selected fields data
   */
  fillForm(user) {
    let insurance = this.masterData.insurance.filter((ins) => {
      return ins.insurance === user.insurance;
    });

    let citiesArr = [];
    let expertiseArr = [];
    this.user.cities.forEach((selectedCity) => {
      let selected = this.masterData.cities.filter((city) => {
        return selectedCity === city.city;
      });
      if (selected && selected[0].id) {
        citiesArr.push(selected[0].id);
      }
    });
    this.user.expertises.forEach((selectedExp) => {
      let selected = this.masterData.expertise.filter((expertise) => {
        return selectedExp === expertise.expertise;
      });
      if (selected && selected[0].id) {
        expertiseArr.push(selected[0].id);
      }
    });
    let license = this.masterData.license.filter((lic) => {
      return this.user.license === lic.license;
    });
    this.editProfileForm.patchValue(user);
    this.editProfileForm.patchValue({ insurance: insurance[0].id });
    this.editProfileForm.get('license').patchValue(license[0].id);
    this.editProfileForm.get('expertise').patchValue(expertiseArr);
    this.editProfileForm.get('cities').patchValue(citiesArr);
  }

  /**
   * push time frame checkbox value into form array
   * @param val current timeframe checkbox selected by the user
   */
  pushTimeFrameVal(val) {
    console.log(this.editProfileForm.value);
    const isExistingTimeFrame = this.editProfileForm
      .get('timeFrames')
      .value.findIndex((timeFrame) => {
        return timeFrame === val;
      });
    if (isExistingTimeFrame < 0) {
      (this.editProfileForm.get('timeFrames') as FormArray).push(
        this.fb.control(val)
      );
    } else {
      (this.editProfileForm.get('timeFrames') as FormArray).removeAt(
        isExistingTimeFrame
      );
    }
  }
}
