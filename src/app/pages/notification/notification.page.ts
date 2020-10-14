import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular'; 
import { NotificationService } from '../../providers/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  notificationData = [];

  constructor(
    public menuCtrl: MenuController,
    public notificationService: NotificationService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  ionViewDidEnter() {
    this.loadNotification();
  }

  loadNotification() {
    this.notificationService.getNotifyData().subscribe(resp => {
      console.log('resp>>', resp)
      this.notificationData = resp.data;
    })
  }
}
