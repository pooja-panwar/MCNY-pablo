import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { NotificationService } from '../../providers/notification.service';
import { Router, NavigationExtras } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  notificationData = null;
  limit = 15;
  fromNotification = false;
  constructor(
    public menuCtrl: MenuController,
    public notificationService: NotificationService,
    private router: Router,
    private platform: Platform,
    private location: Location
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  ionViewDidEnter() {
    this.loadNotification(this.limit);
  }
  ionViewDidLeave() {
    this.notificationData = null;
  }

  loadNotification(limit = 0) {
    this.notificationService.getNotifyData(limit).subscribe((resp) => {
      console.log('resp>>', resp);
      this.notificationData = resp.data;
    });
  }

  openDetail(notifyId = 0, inquiryId = 0, reqId = 0) {
    if (notifyId !== 0) {
      this.notificationService.readNotification(notifyId).subscribe((resp) => {
        console.log('resp>>', resp);
        if (resp.status == 'success') {
          if (inquiryId !== 0) {
            let navigationExtras: NavigationExtras = {
              state: {
                inquiryId: inquiryId,
                reqId: reqId,
                page: 'notification',
              },
            };
            this.router.navigate(['request-details'], navigationExtras);
          }
        }
      });
    }
  }
}
