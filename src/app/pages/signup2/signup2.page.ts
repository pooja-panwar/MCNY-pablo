import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-signup2',
  templateUrl: './signup2.page.html',
  styleUrls: ['./signup2.page.scss'],
})
export class Signup2Page implements OnInit {
  signUpForm: FormGroup;
  isSubmitted = false;
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
  constructor(public menuCtrl: MenuController, private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
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
   * push time gramce checkbox value into form array
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
  }

  get errorControl() {
    return this.signUpForm.controls;
  }
}
