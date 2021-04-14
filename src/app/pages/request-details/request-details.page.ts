import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  InquiryDetail,
  PatientInquiryService,
} from '../../providers/patient-inquiry.service';
//import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { SchedulerPopoverComponent } from './scheduler-popover/scheduler-popover.component';
import { PopoverController, Platform, NavController } from '@ionic/angular';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/providers/global.service';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.page.html',
  styleUrls: ['./request-details.page.scss'],
  //providers:[InquiryDetail]
})
export class RequestDetailsPage implements OnInit {
  inquiryId: number;
  inqueryData: InquiryDetail;
  inquiryFileName: string;
  inquiryReqId: number;
  disableDownload: boolean = false;
  rejectAction: string = 'reject';
  fromPage: string = '';
  pageTitle: string = 'Inquiry';
  setSchedule = true;
  inquiryStatus: string = 'pending';
  popover: any;
  fromNotification = false;
  appointmentOver = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientInquiry: PatientInquiryService,
    private popoverController: PopoverController,
    public navCtrl: NavController,
    private common: CommonService
  ) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.inquiryId = this.router.getCurrentNavigation().extras.state.inquiryId;
        this.inquiryReqId = this.router.getCurrentNavigation().extras.state.reqId;
        // this.fromNotification = this.router.getCurrentNavigation().extras.state.fromNotification;
        this.fromPage = this.router.getCurrentNavigation().extras.state.page;
        this.inquiryStatus = this.router.getCurrentNavigation().extras.state
          .inquiryStatus
          ? this.router.getCurrentNavigation().extras.state.inquiryStatus
          : 'pending';
        this.pageTitle =
          this.fromPage == 'notification' || this.fromPage == 'inquiry-list'
            ? 'Inquiry'
            : 'Details';
        this.rejectAction =
          this.inquiryStatus == 'pending'
            ? 'reject'
            : this.inquiryStatus == 'active'
            ? 'cancel'
            : 'reject';
      }
    });
    this.patientInquiry.downloadEnqSubject.subscribe((data) => {
      if (data === true) {
        this.rejectAction = 'cancel';
        this.inquiryStatus = 'active';
      }
    });
    // this.platform.backButton.subscribeWithPriority(0, () => {
    //   if (this.popover) {
    //     this.popover.dismiss();
    //   } else {
    //     this.location.back();
    //   }
    // });
  }

  ngOnInit() {
    this.patientInquiry.changeDisable().subscribe((value) => {
      this.disableDownload = value;
    });

    this.patientInquiry.schedulePopupClosed.subscribe((data) => {
      if (data) {
        this.popover = null;
        this.common.isPopupOpened = false;
      }
    });
  }

  ionViewWillEnter() {
    this.loadPatientInquiry();
    this.patientInquiry.scheduleStatus.subscribe((data) => {
      if (data && data === true) {
        this.setSchedule = false;
        this.loadPatientInquiry();
      }
    });
  }

  ionViewDidLeave() {
    this.popoverController.dismiss();
    this.rejectAction = 'reject';
    this.inquiryStatus = 'pending';
    this.appointmentOver = false;
  }

  loadPatientInquiry() {
    this.patientInquiry.getPatientInquiry(this.inquiryId).subscribe((resp) => {
      this.inqueryData = resp;
      this.inquiryFileName = resp.vcfFileName;
      this.isAppointmentDone();
      if (this.inqueryData.dob) {
        this.inqueryData.dob = this.inqueryData.dob.split('T')[0];
      }
    });
  }
  isAppointmentDone() {
    if (this.inqueryData.appointment) {
      if (
        new Date(this.inqueryData.appointment).getTime() < new Date().getTime()
      ) {
        this.appointmentOver = true;
      }
    }
  }

  downloadInquiry() {
    this.patientInquiry
      .presentAlertConfirm(
        this.inquiryFileName,
        this.inquiryReqId,
        'accept',
        this.inquiryStatus
      )
      .then((res) => {
        //this.rejectAction = 'cancel';
      });
  }

  rejectInquiry() {
    this.patientInquiry
      .presentAlertConfirm(
        this.inquiryFileName,
        this.inquiryReqId,
        this.rejectAction,
        this.inquiryStatus
      )
      .then((res) => {
        console.log('reject in comp', res);
      });
  }

  async schedule(ev: any) {
    this.popover = await this.popoverController.create({
      component: SchedulerPopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      backdropDismiss: true,
      componentProps: {
        patientEnquiryId: this.inqueryData.id,
      },
    });
    this.common.isPopupOpened = true;
    this.popover.present();
  }
}
