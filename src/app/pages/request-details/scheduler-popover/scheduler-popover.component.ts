import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { PatientInquiryService } from 'src/app/providers/patient-inquiry.service';
import * as moment from 'moment-timezone';
import * as momentjs from 'moment';
import { CommonService } from 'src/app/providers/global.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-scheduler-popover',
  templateUrl: './scheduler-popover.component.html',
  styleUrls: ['./scheduler-popover.component.scss'],
})
export class SchedulerPopoverComponent implements OnInit {
  scheduleDate: any;
  minDate: any;
  scheduleTime: any;
  scheDate: any;
  scheTime: any;
  maxDate: any;
  model: NgbDateStruct;
  date: { year: number; month: number };
  invalidTime = false;

  @Output() status = new EventEmitter();
  patientEnquiryId: any;
  constructor(
    public popoverController: PopoverController,
    private patient: PatientInquiryService,
    private navParams: NavParams,
    private common: CommonService
  ) {
    this.patientEnquiryId = this.navParams.get('patientEnquiryId');
    this.scheduleDate = new Date().toISOString();
    this.minDate = formatDate(
      new Date(),
      'yyyy-MM-dd',
      'en-US',
      `${moment.tz.guess()}`
    );
    this.maxDate = new Date().getFullYear() + 1;
    // this.scheduleTime = this.resetMinTime();
  }

  ngOnInit() {}

  ionViewDidLeave() {
    this.common.isPopupOpened = false;
    this.patient.schedulePopupClosed.next(true);
  }

  schedule() {
    if (this.scheDate && this.scheTime && this.timeSelected(this.scheTime)) {
      const selDate = formatDate(
        this.scheDate,
        'yyyy-MM-dd',
        'en-US',
        `${moment.tz.guess()}`
      );
      //const selTime = formatDate(this.scheTime, 'hh:mm:ss', 'en-US', '+0530');
      let t = new Date(this.scheTime);
      const selTime = `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`;
      let schedule;
      schedule = new Date(selDate);
      schedule = new Date(new Date((schedule.setHours(t.getHours()))).setMinutes(t.getMinutes())).toISOString();
      const body = {
        appointmentTime: schedule,
        patientEnquiryId: this.patientEnquiryId,
        timeZone: moment.tz.guess(),
      };

      this.patient.scheduleAppointment(body).subscribe((data) => {
        this.popoverController.dismiss();
        this.patient.scheduleStatus.next(true);
      });
    }
  }
  dateSelected(e) {
    const selectedDate = new Date(e);
    this.scheTime = '';
    if (
      selectedDate.getMonth() === new Date().getMonth() &&
      selectedDate.getDate() == new Date().getDate() &&
      selectedDate.getFullYear() == new Date().getFullYear()
    ) {
      this.scheduleTime = this.resetMinTime();
    } else {
      this.scheduleTime = '00:00:00';
    }
  }

  resetMinTime() {
    return formatDate(
      this.scheduleDate,
      'hh:mm',
      'en-US',
      `${moment.tz.guess()}`
    );
  }
  timeSelected(e) {
    this.invalidTime = false;
    if (e && this.scheDate) {
      let time = new Date(new Date().setHours(e.hour));
      time = new Date(time.setMinutes(e.minute));
      this.scheTime = time;
      const selectedDate = new Date(this.scheDate);
      if (
        selectedDate.getMonth() === new Date().getMonth() &&
        selectedDate.getDate() == new Date().getDate() &&
        selectedDate.getFullYear() == new Date().getFullYear()
      ) {
        if (time.getTime() < new Date().getTime()) {
          this.invalidTime = true;
          this.scheTime = '';
          return false;
        }
      }
    }
    return true;
  }
}
