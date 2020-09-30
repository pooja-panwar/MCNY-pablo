import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { UserService } from 'src/app/providers/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user = { name: 'Serena Gome', phoneNumber: '+9125124147' };
  constructor(
    public menuCtrl: MenuController,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getUserPofile();
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  getUserPofile() {
    this.userService.getUserProfile('').subscribe((data) => {
      this.user = data;
    });
  }
}
