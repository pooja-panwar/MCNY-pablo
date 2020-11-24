import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { PatientInquiryService } from 'src/app/providers/patient-inquiry.service';
import * as moment from 'moment-timezone';

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
  @Output() status = new EventEmitter();
  patientEnquiryId: any;
  constructor(
    public popoverController: PopoverController,
    private patient: PatientInquiryService,
    private navParams: NavParams
  ) {
    this.patientEnquiryId = this.navParams.get('patientEnquiryId');
    this.scheduleDate = new Date().toISOString();
    this.minDate = new Date().toISOString();
    this.scheduleTime = formatDate(
      this.scheduleDate,
      'hh:mm:ss',
      'en-US',
      '+0530'
    );
  }

  ngOnInit() {}

  schedule() {
    if (this.scheDate && this.scheTime) {
      const selDate = formatDate(this.scheDate, 'yyyy-MM-dd', 'en-US', '+0530');
      //const selTime = formatDate(this.scheTime, 'hh:mm:ss', 'en-US', '+0530');
      let t = new Date(this.scheTime);
      const selTime = `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`;
      const schedule = selDate + ' ' + selTime;
      const body = {
        appointmentTime: new Date(schedule).toISOString(),
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
    if (
      selectedDate.getMonth() === new Date().getMonth() &&
      selectedDate.getDate() == new Date().getDate()
    ) {
      this.scheduleTime;
    }
  }
}
