import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular'; 

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  notificationData =  {"data": [
    {
        "id": 6,
        "doctorId": 29,
        "title": "Title 1",
        "body": "Body 1",
        "isRead": false,
        "createdAt": "2020-10-05T05:13:25.000Z",
        "updatedAt": "2020-10-05T05:13:25.000Z"
    },
    {
        "id": 7,
        "doctorId": 29,
        "title": "Title 1",
        "body": "Body 1",
        "isRead": false,
        "createdAt": "2020-10-05T05:13:25.000Z",
        "updatedAt": "2020-10-05T05:13:25.000Z"
    },
    {
        "id": 8,
        "doctorId": 29,
        "title": "Title 1",
        "body": "Body 1",
        "isRead": false,
        "createdAt": "2020-10-05T05:13:25.000Z",
        "updatedAt": "2020-10-05T05:13:25.000Z"
    },
    {
        "id": 9,
        "doctorId": 29,
        "title": "Title 1",
        "body": "Body 1",
        "isRead": false,
        "createdAt": "2020-10-05T05:13:25.000Z",
        "updatedAt": "2020-10-05T05:13:25.000Z"
    },
    {
        "id": 10,
        "doctorId": 29,
        "title": "Title 1",
        "body": "Body 1",
        "isRead": false,
        "createdAt": "2020-10-05T05:13:25.000Z",
        "updatedAt": "2020-10-05T05:13:25.000Z"
    }
]}

  constructor(
    public menuCtrl: MenuController
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
      this.menuCtrl.enable(true);
  }

}
