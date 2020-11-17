import { Component, OnInit } from '@angular/core';
import {PatientInquiryService} from '../../providers/patient-inquiry.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-inquiry-list',
  templateUrl: './inquiry-list.page.html',
  styleUrls: ['./inquiry-list.page.scss'],
})
export class InquiryListPage implements OnInit {
  activeInquiries: any;
  activeClass: boolean = true;
  activeInquiriesAll: any;

  constructor(
    private patientInquiry: PatientInquiryService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loadAcceptedRequest();
  }

  loadAcceptedRequest() {
    this.patientInquiry.getAllInquiries('all').subscribe(res=>{
      console.log(res);
      this.activeInquiriesAll = res.data.filter(inquiry => inquiry.status != 'inactive');
      this.selectTab('pending')
    })
  }

  openDetail(inquiryId = 0, reqId = 0, inquiryStatus) {
    let navigationExtras: NavigationExtras = {
      state: {
        inquiryId: inquiryId,
        reqId: reqId,
        page: 'inquiry-list',
        inquiryStatus: inquiryStatus
      }
    };
    this.router.navigate(['request-details'], navigationExtras);
  }

  selectTab(tab) {
    this.activeClass = tab == 'active' ? true: false;
    //let matchStatus = tab == 'active'? 'purchased': 'non purchased';
    this.activeInquiries = this.activeInquiriesAll.filter(inquiry => inquiry.status == tab);
    console.log(this.activeInquiries);
  }

}
