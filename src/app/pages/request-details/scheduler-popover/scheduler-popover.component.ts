import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import {formatDate } from '@angular/common';

@Component({
  selector: 'app-scheduler-popover',
  templateUrl: './scheduler-popover.component.html',
  styleUrls: ['./scheduler-popover.component.scss'],
})
export class SchedulerPopoverComponent implements OnInit {
  scheduleDate:any;
  minDate: any;
  scheduleTime:any;
  scheDate:any;
  scheTime:any;
  
  constructor(
    public popoverController: PopoverController,
    ) {
    // this.expertises = this.navParams.get('expertises');
    this.scheduleDate = new Date().toISOString();
    this.minDate = new Date().toISOString();
    this.scheduleTime = formatDate(this.scheduleDate, 'hh:mm:ss', 'en-US', '+0530');

  }

  ngOnInit() {}

  schedule() {
    this.scheDate = formatDate(this.scheDate, 'dd-MM-yyyy', 'en-US', '+0530');
    this.scheTime = formatDate(this.scheTime, 'hh:mm:ss', 'en-US', '+0530');
    console.log(this.scheDate, this.scheTime);
    this.popoverController.dismiss();
  }

}
