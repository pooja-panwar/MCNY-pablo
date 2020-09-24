import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular'; 

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  constructor(
    public menuCtrl: MenuController
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
      this.menuCtrl.enable(true);
  }

}
