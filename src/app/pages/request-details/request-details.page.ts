import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  InquiryDetail,
  PatientInquiryService,
} from '../../providers/patient-inquiry.service';
//import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { SchedulerPopoverComponent } from './scheduler-popover/scheduler-popover.component';
import { PopoverController } from '@ionic/angular';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientInquiry: PatientInquiryService,
    private popoverController: PopoverController
  ) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.inquiryId = this.router.getCurrentNavigation().extras.state.inquiryId;
        this.inquiryReqId = this.router.getCurrentNavigation().extras.state.reqId;
        this.fromPage = this.router.getCurrentNavigation().extras.state.page;
        this.inquiryStatus = this.router.getCurrentNavigation().extras.state
          .inquiryStatus
          ? this.router.getCurrentNavigation().extras.state.inquiryStatus
          : 'pending';
        console.log('Inquiry is ' + this.inquiryStatus);

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
  }

  ngOnInit() {
    this.patientInquiry.changeDisable().subscribe((value) => {
      this.disableDownload = value;
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

  loadPatientInquiry() {
    this.inqueryData = this.patientInquiry.emptyInquiry();
    this.patientInquiry.getPatientInquiry(this.inquiryId).subscribe((resp) => {
      this.inqueryData = resp;
      this.inquiryFileName = resp.vcfFileName;
    });
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
        this.rejectAction = 'cancel';
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
    const popover = await this.popoverController.create({
      component: SchedulerPopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      backdropDismiss: false,
      componentProps: {
        patientEnquiryId: this.inqueryData.id,
      },
    });
    return await popover.present();
  }
}
