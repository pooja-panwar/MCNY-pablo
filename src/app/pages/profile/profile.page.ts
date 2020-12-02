import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
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
// import { ImageCroppedEvent } from 'ngx-image-cropper';
// import { Crop } from '@ionic-native/crop/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public user: any;
  subscribed;
  toEditprofile = false;
  profileImage: string; ////
  // imageChangedEvent: any = '';
  imageDataFromPlugin: string;
  notifyCount: number = 0;
  public masterData: any;

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
    private sanitizer: DomSanitizer, // private crop: Crop
    private navCtrl: NavController
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.user = [];
    this.toEditprofile = false;
    this.menuCtrl.enable(true);
    this.getUserPofile('init');
    this.common.isEditPage = false;

    this.platform.backButton.subscribeWithPriority(0, () => {
      //back handle for android
      if (this.router.url === '/profile') {
        if (this.toEditprofile) {
          this.toEditprofile = !this.toEditprofile;
          //this.common.isEditPage = this.toEditprofile;
        } else {
          navigator['app'].exitApp();
        }
      }
    });
  }

  ionViewDidLeave() {
    this.common.isEditPage = false;
  }

  //get current user profile details
  getUserPofile(fromCall) {
    this.userService.getUserProfile().subscribe((data) => {
      this.getRegisterMasterData();
      this.user = data.data.doctor;
      if (this.user && this.user.insurances) {
        this.user.insurances1 = this.user.insurances.map(
          (insurance) => insurance.insurance
        );
      }
      this.user.counselingDisplay =
        this.user && this.user.counselingMethod
          ? Object.values(this.user.counselingMethod)[0]
          : '';
      if (fromCall == 'init') {
        this.profileImage = data.data.doctor.profileImage;
      }
      this.notifyCount = data.data.doctor.notificationCount;
      this.common.emitUserSubject(this.user);
    });
  }

  open() {
    this.menuCtrl.toggle('end');
  }

  //preset popover to show expertises
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

  /**
   * update user data and send details to backend
   * @param userData user updated form data
   */
  emitSaveProfile(userData) {
    if (userData === false) {
      this.toEditprofile = false;
      this.common.isEditPage = false;
    } else {
      userData.phoneNumber = `${userData.phoneNumber}`;
      this.userService.editDoctorProfile(userData).subscribe((data) => {
        if (data.status === 'success') {
          this.getUserPofile('save');
          this.toEditprofile = false;
          this.common.isEditPage = false;
          this.common.presentToast('Your profile is successfully updated');
        }
      });
      if (this.imageDataFromPlugin) {
        let param = { imageData: this.imageDataFromPlugin };
        this.takePhoto.startUpload(param);
        this.imageDataFromPlugin = '';
      }
    }
  }

  /**
   * set photo from camera and gallery to page view
   */
  setPhotoOnView(imageData) {
    this.imageDataFromPlugin = imageData;
    let converted;
    if (this.platform.is('ios')) {
      converted = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.webview.convertFileSrc(imageData)
      );
    } else {
      converted = this.webview.convertFileSrc(imageData);
    }

    this.profileImage = converted;
  }

  async editProfile() {
    if (this.toEditprofile) {
      await this.actionSheet.present([
        {
          text: 'Load from Library',
          handler: () => {
            this.takePhoto.takePicture('library').then(
              (imageData) => {
                console.log('imagedata lib in profile comp', imageData);
                let file_url = '';
                if (this.platform.is('ios')) {
                  file_url = imageData;
                } else {
                  file_url = 'file://' + imageData;
                }
                console.log('imagedata after>', file_url);

                this.takePhoto.cropImage(file_url).then(
                  (newPath) => {
                    console.log('new path lib>>>', newPath);
                    this.setPhotoOnView(newPath);
                  },
                  (error) => {
                    //alert('Error cropping image' + error);
                    console.log(error);
                  }
                );
                //this.setPhotoOnView(imageData);
              },
              (err) => {
                console.log(err);
              }
            );
          },
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePhoto.takePicture('camera').then(
              (imageData) => {
                console.log('imagedata camera in profile comp', imageData);
                let file_url = '';
                if (this.platform.is('ios')) {
                  file_url = imageData;
                } else {
                  file_url = 'file://' + imageData;
                }
                console.log('imagedata after>', file_url);
                this.takePhoto.cropImage(file_url).then(
                  (newPath) => {
                    console.log('new path>>>', newPath);
                    this.setPhotoOnView(newPath);
                  },
                  (error) => {
                    //alert('Error cropping image' + error);
                    console.log(error);
                  }
                );
              },
              (err) => {
                console.log('error>>');
                console.log(err);
              }
            );
          },
        },
      ]);
    }
  }
  /**
   * get master data for all the
   * required fields used in signup
   */
  getRegisterMasterData() {
    this.userService.getSignUpMasterData().subscribe((data) => {
      this.masterData = data.data;
    });
  }
  changeAction() {
    this.toEditprofile = !this.toEditprofile;
    this.common.isEditPage = this.toEditprofile;
  }
}
