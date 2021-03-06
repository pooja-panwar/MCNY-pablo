import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { MenuController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { CommonService } from './providers/global.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { UserDataService } from './providers/user-data.service';
import { UserService } from './providers/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public selectedIndex = 0;
  public showMenuBar = false;
  public appPages = [
    {
      title: 'Manage Profile',
      url: '/profile',
      icon: 'assets/img/profile.png',
      class: 'icon1',
    },
    {
      title: 'Accepted Requests',
      url: '/accepted-requests',
      icon: 'assets/img/request.png',
      class: 'icon2',
    },
    {
      title: 'Inquiry List',
      url: '/inquiry-list',
      icon: 'assets/img/call.png',
      class: 'icon3',
    },
    {
      title: 'Notification',
      url: '/notification',
      icon: 'assets/img/bell.png',
      class: 'icon4',
    },
    {
      title: 'Logout',
      url: '',
      icon: 'assets/img/logout.png',
      class: 'Logout',
    },
  ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public menuCtrl: MenuController,
    private router: Router,
    private common: CommonService,
    private navCtrl: NavController,
    private firebaseX: FirebaseX,
    private userDataService: UserDataService,
    private userService: UserService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then((source) => {
      this.userDataService.setUserData().then((res) => {
        // let status bar overlay webview
        this.statusBar.overlaysWebView(false);
        this.statusBar.styleLightContent();
        // set status bar to app default header color
        this.statusBar.backgroundColorByHexString('#1b346a');
        //this.splashScreen.hide();
        this.splashScreen.hide();
        this.checkPermission();
        
      });
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        (page) => page.title.toLowerCase() === path.toLowerCase()
      );
    }
    this.handleBackNav();
    this.allowSideMenu();

  }
  toggleMenu() {
    this.menuCtrl.toggle('end');
  }

  /**
   * get firebase device token
   */
  initFirebasePush() {
    this.firebaseX
      .getToken()
      .then((token) => {
        console.log(`The token is ${token}`);
        this.common.saveLocal('device_token', token);
      }) // save the token server-side and use it to push notifications to this device
      .catch((error) => console.error('Error getting token' + error));

    this.firebaseX.onMessageReceived().subscribe((data) => {
      console.error(`User opened a notification ${data}`);
      if (data.page === 'request-details') {
        let navigationExtras: NavigationExtras = {
          state: {
            inquiryId: data.inquiryId,
            reqId: data.reqId,
            page: 'accepted-requests',
            inquiryStatus: data.inquiryStatus,
            fromNotification: true,
          },
        };
        this.router.navigate(['request-details'], navigationExtras);
      } else {
        let navigationExtras: NavigationExtras = {
          state: {
            fromNotification: true,
          },
        };
        this.router.navigate(['notification'], navigationExtras);
      }
    });
  }

  checkPermission() {
    console.log('push has permission>>', this.firebaseX.hasPermission());
    this.firebaseX.hasPermission().then((isPerm) => {
      console.log(isPerm);
      if (isPerm) {
        console.log('yes perm');
        this.initFirebasePush();
      } else {
        console.log('no perm');
        this.firebaseX
          .grantPermission()
          .then(() => {
            this.initFirebasePush();
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            console.log('done push>>>');
          });
      }
    });
  }

  /**
   * call common service fn to check
   * for hardware back button event
   */
  handleBackNav() {
    this.common.handleBackNavigation();
  }

  allowSideMenu() {
    this.router.events.subscribe((data) => {
      const path = window.location.pathname.split('/')[1];
      if (
        path !== '' &&
        path !== 'login' &&
        path !== 'signup1' &&
        path !== 'signup2' &&
        path !== 'forgot-password' &&
        path !== 'email-verification' &&
        path !== 'registration-success-message' &&
        path !== 'reset-password'
      ) {
        this.showMenuBar = true;
      } else {
        this.showMenuBar = false;
      }
    });
  }

  /**
   * click on menu items
   * @param menu
   */
  menuClick(menu) {
    switch (menu.title) {
      case 'Logout':
        this.userService.userLogout().subscribe((data) => {
          this.userService.logout();
        });
        break;

      default:
        this.navCtrl.navigateBack(menu.url);
        break;
    }
  }
}
