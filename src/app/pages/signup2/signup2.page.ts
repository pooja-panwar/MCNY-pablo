import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular'; 

@Component({
  selector: 'app-signup2',
  templateUrl: './signup2.page.html',
  styleUrls: ['./signup2.page.scss'],
})
export class Signup2Page implements OnInit {

  constructor(
    public menuCtrl: MenuController
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
      this.menuCtrl.enable(false);
  }

}
