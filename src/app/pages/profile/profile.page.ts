import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { UserService } from 'src/app/providers/user.service';
import { CommonService } from 'src/app/providers/global.service';
import { Router } from '@angular/router';
import { ExpertisePopoverComponent } from './popover/expertise-popover/expertise-popover.component';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public user;
  toEditprofile = false;
  constructor(
    public menuCtrl: MenuController,
    private userService: UserService,
    private router: Router,
    private common: CommonService,
    public popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.getUserPofile();
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  //get current user profile details
  getUserPofile() {
    this.userService.getUserProfile().subscribe((data) => {
      this.user = data.data.doctor;
      this.common.emitUserSubject(this.user);
    });
  }

  open() {
    this.menuCtrl.toggle();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: ExpertisePopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      componentProps: {
        expertises: this.user.expertises,
      },
    });
    return await popover.present();
  }
}
