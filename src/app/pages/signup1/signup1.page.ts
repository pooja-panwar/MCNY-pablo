import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular'; 

@Component({
  selector: 'app-signup1',
  templateUrl: './signup1.page.html',
  styleUrls: ['./signup1.page.scss'],
})
export class Signup1Page implements OnInit {

  constructor(
    public menuCtrl: MenuController
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
      this.menuCtrl.enable(false);
  }

}
