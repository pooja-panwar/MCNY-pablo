import { Component, OnInit } from '@angular/core';
import { PatientInquiryService } from '../../providers/patient-inquiry.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-accepted-requests',
  templateUrl: './accepted-requests.page.html',
  styleUrls: ['./accepted-requests.page.scss'],
})
export class AcceptedRequestsPage implements OnInit {
  activeInquiries = null;
  constructor(
    private patientInquiry: PatientInquiryService,
    private router: Router
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.loadAcceptedRequest();
  }

  ionViewDidLeave() {
    this.activeInquiries = null;
  }

  loadAcceptedRequest() {
    this.patientInquiry.getAllInquiries('active').subscribe((res) => {
      this.activeInquiries = res.data;
    });
  }

  openDetail(inquiryId = 0, reqId = 0, inquiryStatus) {
    let navigationExtras: NavigationExtras = {
      state: {
        inquiryId: inquiryId,
        reqId: reqId,
        page: 'accepted-requests',
        inquiryStatus: inquiryStatus,
      },
    };
    this.router.navigate(['request-details'], navigationExtras);
  }
}
