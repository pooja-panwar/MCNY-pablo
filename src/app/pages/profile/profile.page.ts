import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { UserService } from 'src/app/providers/user.service';
import { CommonService } from 'src/app/providers/global.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { ExpertisePopoverComponent } from './popover/expertise-popover/expertise-popover.component';
import { PopoverController } from '@ionic/angular';
import { TakePhotoService } from '../../providers/take-photo.service';
import { ActionSheetService } from '../../providers/action-sheet.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public user;
  toEditprofile = false;
  profileImage: string;
  imageDataFromPlugin: string;

  constructor(
    public menuCtrl: MenuController,
    private userService: UserService,
    private router: Router,
    private common: CommonService,
    public popoverController: PopoverController,
    private takePhoto: TakePhotoService,
    private actionSheet: ActionSheetService,
    private platform: Platform,
    private webview: WebView,
    private sanitizer: DomSanitizer,
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

  emitSaveProfile(userData) {
    console.log(userData);
    delete userData.name;
    delete userData.email;
    this.userService.editDoctorProfile(userData).subscribe((data) => {
      if (data.status === 'success') {
        this.getUserPofile();
        this.toEditprofile = false;
        this.common.presentToast('Your profile is successfully updated');
      }
    });
    let param = { imageData: this.imageDataFromPlugin };
    this.takePhoto.startUpload(param);
    this.imageDataFromPlugin = '';
  }

  /**
   * set photo from camera and gallery to page view
   */
  setPhotoOnView(imageData) {
    this.imageDataFromPlugin = imageData;
    let converted;
    if(this.platform.is('ios')){
      converted = this.sanitizer.bypassSecurityTrustResourceUrl(this.webview.convertFileSrc(imageData));
    } else {
      converted = this.webview.convertFileSrc(imageData);
    }
    
    this.profileImage = converted;
  }

  async editProfile() {
    if(this.toEditprofile) {
      await this.actionSheet.present([
        {
          text: 'Load from Library',
          handler: () => {
            this.takePhoto.takePicture('library').then((imageData) => {
              this.setPhotoOnView(imageData);
            }, (err) => {
              console.log(err);
            });
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePhoto.takePicture('camera').then((imageData) => {
              this.setPhotoOnView(imageData);
            }, (err) => {
              console.log(err);
            });
          }
        }
      ]);
    }
  }
}
